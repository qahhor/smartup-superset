/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {
  ColorFormatters,
  getColorFormatters,
  Metric,
} from '@superset-ui/chart-controls';
import {
  getMetricLabel,
  NumberFormats,
  createDurationFormatter,
  getNumberFormatter,
  NumberFormatter,
} from '@superset-ui/core';
import {
  SmartupKPIChartProps,
  SmartupKPIVizProps,
  SmartupNumberFormatType,
  SMARTUP_LOCALES,
} from './types';
import { Refs } from '../types';

/**
 * Parse metric value from query response
 */
function parseMetricValue(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

/**
 * Get the original metric label from datasource
 */
function getOriginalLabel(
  metric: string | object | undefined,
  metrics: Metric[],
): string {
  if (!metric) return '';

  if (typeof metric === 'string') {
    const found = metrics.find(m => m.metric_name === metric);
    return found?.verbose_name || found?.metric_name || metric;
  }

  if (typeof metric === 'object' && 'label' in metric) {
    return (metric as any).label || '';
  }

  return getMetricLabel(metric);
}

/**
 * Create a custom number formatter based on SmartupKPI settings
 */
function createSmartupFormatter(
  formatType: SmartupNumberFormatType,
  locale: string,
  customFormat?: string,
  prefix?: string,
  suffix?: string,
): (value: number) => string {
  const localeConfig = SMARTUP_LOCALES[locale] || SMARTUP_LOCALES.ru;

  // Helper to format with locale separators
  const formatWithLocale = (num: number, decimals: number = 0): string => {
    const parts = num.toFixed(decimals).split('.');
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, localeConfig.thousands);
    const decPart = parts[1];
    return decPart ? `${intPart}${localeConfig.decimal}${decPart}` : intPart;
  };

  // Helper to format large numbers with suffix
  const formatLargeNumber = (
    num: number,
    divisor: number,
    suffixText: string,
    decimals: number = 2,
  ): string => {
    const divided = num / divisor;
    return `${formatWithLocale(divided, decimals)}${suffixText}`;
  };

  return (value: number): string => {
    let formattedValue: string;

    switch (formatType) {
      case 'integer':
        formattedValue = formatWithLocale(Math.round(value), 0);
        break;

      case 'decimal_1':
        formattedValue = formatWithLocale(value, 1);
        break;

      case 'decimal_2':
        formattedValue = formatWithLocale(value, 2);
        break;

      case 'thousands':
        formattedValue = formatLargeNumber(
          value,
          1000,
          localeConfig.shortScale.thousands,
          2,
        );
        break;

      case 'millions':
        formattedValue = formatLargeNumber(
          value,
          1_000_000,
          localeConfig.shortScale.millions,
          2,
        );
        break;

      case 'billions':
        formattedValue = formatLargeNumber(
          value,
          1_000_000_000,
          localeConfig.shortScale.billions,
          2,
        );
        break;

      case 'percent':
        formattedValue = `${formatWithLocale(value * 100, 1)}%`;
        break;

      case 'percent_decimal':
        formattedValue = `${formatWithLocale(value * 100, 2)}%`;
        break;

      case 'smart': {
        // Auto-select format based on value magnitude
        const absValue = Math.abs(value);
        if (absValue >= 1_000_000_000) {
          formattedValue = formatLargeNumber(
            value,
            1_000_000_000,
            localeConfig.shortScale.billions,
            2,
          );
        } else if (absValue >= 1_000_000) {
          formattedValue = formatLargeNumber(
            value,
            1_000_000,
            localeConfig.shortScale.millions,
            2,
          );
        } else if (absValue >= 1000) {
          formattedValue = formatWithLocale(Math.round(value), 0);
        } else if (absValue >= 1) {
          formattedValue = formatWithLocale(value, 2);
        } else if (absValue > 0) {
          // Small decimal, likely a percentage
          formattedValue = `${formatWithLocale(value * 100, 1)}%`;
        } else {
          formattedValue = '0';
        }
        break;
      }

      case 'custom': {
        // Use D3 formatter
        try {
          const d3Formatter = getNumberFormatter(customFormat || ',.2f');
          formattedValue = d3Formatter(value);
        } catch {
          formattedValue = value.toString();
        }
        break;
      }

      default:
        formattedValue = formatWithLocale(value, 0);
    }

    // Add prefix and suffix
    const finalPrefix = prefix || '';
    const finalSuffix = suffix || '';

    return `${finalPrefix}${formattedValue}${finalSuffix}`;
  };
}

/**
 * Transform chart props to visualization props
 */
export default function transformProps(
  chartProps: SmartupKPIChartProps,
): SmartupKPIVizProps {
  const {
    width,
    height,
    queriesData,
    formData,
    hooks,
    theme,
  } = chartProps;

  const {
    metric = 'value',
    headerFontSize = 0.4,
    subtitleFontSize = 0.125,
    metricNameFontSize = 0.1,
    showMetricName = true,
    subtitle = '',
    numberFormatType = 'smart',
    customNumberFormat,
    numberPrefix,
    numberSuffix,
    numberLocale = 'ru',
    defaultColor,
    conditionalFormatting,
  } = formData;

  const refs: Refs = {};
  const { data = [] } = queriesData[0] || {};
  const metrics = chartProps.datasource?.metrics || [];

  // Get metric name and value
  const metricLabel = getMetricLabel(metric);
  const originalLabel = getOriginalLabel(metric, metrics);
  const bigNumber = data.length === 0 ? null : parseMetricValue(data[0][metricLabel]);

  // Create formatter
  const headerFormatter = createSmartupFormatter(
    numberFormatType as SmartupNumberFormatType,
    numberLocale,
    customNumberFormat,
    numberPrefix,
    numberSuffix,
  );

  // Get default color from color picker or use theme default
  let numberColor: string | undefined;
  if (defaultColor && typeof defaultColor === 'object') {
    const { r, g, b, a } = defaultColor as { r: number; g: number; b: number; a: number };
    numberColor = `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // Get color formatters for conditional formatting
  const defaultColorFormatters = [] as ColorFormatters;
  const colorThresholdFormatters =
    getColorFormatters(conditionalFormatting, data, theme, false) ??
    defaultColorFormatters;

  const { onContextMenu } = hooks;

  return {
    width,
    height,
    bigNumber,
    headerFormatter,
    headerFontSize,
    subtitleFontSize,
    metricNameFontSize,
    subtitle,
    metricName: originalLabel,
    showMetricName,
    numberColor,
    colorThresholdFormatters,
    onContextMenu,
    refs,
  };
}
