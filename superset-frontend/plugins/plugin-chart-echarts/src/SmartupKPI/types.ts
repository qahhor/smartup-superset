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
  ChartDataResponseResult,
  DataRecordValue,
  QueryFormData,
  QueryFormMetric,
  ValueFormatter,
} from '@superset-ui/core';
import { ColorFormatters } from '@superset-ui/chart-controls';
import { BaseChartProps, Refs } from '../types';

/**
 * Number format presets for Smartup24 KPI
 */
export type SmartupNumberFormatType =
  | 'integer'           // 1,234,567
  | 'decimal_1'         // 1,234,567.8
  | 'decimal_2'         // 1,234,567.89
  | 'thousands'         // 1,234.57K (тыс.)
  | 'millions'          // 1.23M (млн.)
  | 'billions'          // 1.23B (млрд.)
  | 'percent'           // 99.8%
  | 'percent_decimal'   // 99.80%
  | 'currency_uzs'      // 1,234,567 UZS
  | 'currency_usd'      // $1,234,567
  | 'smart'             // Auto-select based on value
  | 'custom';           // Custom D3 format

/**
 * Color threshold configuration
 */
export interface SmartupColorThreshold {
  value: number;
  color: string;
  operator: '<' | '<=' | '>' | '>=' | '==' | '!=';
}

/**
 * Form data for SmartupKPI visualization
 */
export type SmartupKPIFormData = QueryFormData & {
  metric?: QueryFormMetric;

  // Display options
  headerFontSize?: number;
  subtitleFontSize?: number;
  metricNameFontSize?: number;
  showMetricName?: boolean;
  subtitle?: string;

  // Number formatting
  numberFormatType?: SmartupNumberFormatType;
  customNumberFormat?: string;
  numberPrefix?: string;
  numberSuffix?: string;
  decimalPlaces?: number;
  useGrouping?: boolean;

  // Localization
  numberLocale?: 'en' | 'ru' | 'uz';

  // Color thresholds
  colorThresholds?: SmartupColorThreshold[];
  defaultColor?: string;

  // Conditional formatting (existing Superset feature)
  conditionalFormatting?: any[];

  // Currency
  currencyFormat?: any;
  yAxisFormat?: string;
};

/**
 * Data structure from query response
 */
export interface SmartupKPIDatum {
  [key: string]: number | null;
}

/**
 * Query response for SmartupKPI
 */
export interface SmartupKPIChartDataResponseResult extends ChartDataResponseResult {
  data: SmartupKPIDatum[];
}

/**
 * Chart props passed to the plugin
 */
export type SmartupKPIChartProps = BaseChartProps<SmartupKPIFormData> & {
  formData: SmartupKPIFormData;
  queriesData: SmartupKPIChartDataResponseResult[];
};

/**
 * Props for the visualization component
 */
export interface SmartupKPIVizProps {
  className?: string;
  width: number;
  height: number;

  // Data
  bigNumber?: DataRecordValue;
  metricName?: string;

  // Display
  showMetricName?: boolean;
  subtitle?: string;

  // Font sizes (as proportion of container height)
  headerFontSize: number;
  subtitleFontSize: number;
  metricNameFontSize?: number;

  // Formatting
  headerFormatter: ValueFormatter;

  // Colors
  numberColor?: string;
  colorThresholdFormatters?: ColorFormatters;

  // Interaction
  onContextMenu?: (
    clientX: number,
    clientY: number,
  ) => void;

  refs: Refs;
}

/**
 * Locale configuration for number formatting
 */
export interface SmartupNumberLocale {
  decimal: string;
  thousands: string;
  grouping: number[];
  currency: [string, string];
  shortScale: {
    thousands: string;
    millions: string;
    billions: string;
    trillions: string;
  };
}

/**
 * Predefined locales
 */
export const SMARTUP_LOCALES: Record<string, SmartupNumberLocale> = {
  en: {
    decimal: '.',
    thousands: ',',
    grouping: [3],
    currency: ['$', ''],
    shortScale: {
      thousands: 'K',
      millions: 'M',
      billions: 'B',
      trillions: 'T',
    },
  },
  ru: {
    decimal: ',',
    thousands: ' ',
    grouping: [3],
    currency: ['', ' ₽'],
    shortScale: {
      thousands: 'тыс.',
      millions: 'млн.',
      billions: 'млрд.',
      trillions: 'трлн.',
    },
  },
  uz: {
    decimal: ',',
    thousands: ' ',
    grouping: [3],
    currency: ['', ' сум'],
    shortScale: {
      thousands: 'минг',
      millions: 'млн.',
      billions: 'млрд.',
      trillions: 'трлн.',
    },
  },
};
