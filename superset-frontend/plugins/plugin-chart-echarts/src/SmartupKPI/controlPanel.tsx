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
import { t } from '@superset-ui/core';
import { GenericDataType } from '@apache-superset/core/api/core';
import {
  ControlPanelConfig,
  D3_FORMAT_DOCS,
  Dataset,
  getStandardizedControls,
  CustomControlItem,
} from '@superset-ui/chart-controls';

// Font size options
const FONT_SIZE_OPTIONS_SMALL = [
  { label: t('Tiny'), value: 0.08 },
  { label: t('Small'), value: 0.1 },
  { label: t('Normal'), value: 0.125 },
  { label: t('Large'), value: 0.15 },
  { label: t('Huge'), value: 0.2 },
];

const FONT_SIZE_OPTIONS_LARGE = [
  { label: t('Tiny'), value: 0.2 },
  { label: t('Small'), value: 0.3 },
  { label: t('Normal'), value: 0.4 },
  { label: t('Large'), value: 0.5 },
  { label: t('Huge'), value: 0.6 },
];

// Number format presets
const NUMBER_FORMAT_PRESETS = [
  { label: t('Integer (1,234,567)'), value: 'integer' },
  { label: t('1 Decimal (1,234,567.8)'), value: 'decimal_1' },
  { label: t('2 Decimals (1,234,567.89)'), value: 'decimal_2' },
  { label: t('Thousands (1,234.57K)'), value: 'thousands' },
  { label: t('Millions (1.23M)'), value: 'millions' },
  { label: t('Billions (1.23B)'), value: 'billions' },
  { label: t('Percent (99.8%)'), value: 'percent' },
  { label: t('Percent 2 decimals (99.80%)'), value: 'percent_decimal' },
  { label: t('Smart (auto-select)'), value: 'smart' },
  { label: t('Custom D3 format'), value: 'custom' },
];

// Locale options
const LOCALE_OPTIONS = [
  { label: t('English (1,234.56)'), value: 'en' },
  { label: t('Russian (1 234,56)'), value: 'ru' },
  { label: t('Uzbek (1 234,56)'), value: 'uz' },
];

// Control configurations
const headerFontSize: CustomControlItem = {
  name: 'header_font_size',
  config: {
    type: 'SelectControl',
    label: t('Number Font Size'),
    renderTrigger: true,
    clearable: false,
    default: 0.4,
    options: FONT_SIZE_OPTIONS_LARGE,
    description: t('Font size for the main KPI number'),
  },
};

const subtitleFontSize: CustomControlItem = {
  name: 'subtitle_font_size',
  config: {
    type: 'SelectControl',
    label: t('Subtitle Font Size'),
    renderTrigger: true,
    clearable: false,
    default: 0.125,
    options: FONT_SIZE_OPTIONS_SMALL,
    description: t('Font size for the subtitle text'),
  },
};

const metricNameFontSize: CustomControlItem = {
  name: 'metric_name_font_size',
  config: {
    type: 'SelectControl',
    label: t('Metric Name Font Size'),
    renderTrigger: true,
    clearable: false,
    default: 0.1,
    options: FONT_SIZE_OPTIONS_SMALL,
    description: t('Font size for the metric name'),
    visibility: ({ controls }) => controls?.show_metric_name?.value === true,
    resetOnHide: false,
  },
};

const showMetricName: CustomControlItem = {
  name: 'show_metric_name',
  config: {
    type: 'CheckboxControl',
    label: t('Show Metric Name'),
    renderTrigger: true,
    default: true,
    description: t('Whether to display the metric name above the number'),
  },
};

const subtitle: CustomControlItem = {
  name: 'subtitle',
  config: {
    type: 'TextControl',
    label: t('Subtitle'),
    renderTrigger: true,
    description: t('Description text that shows below the number'),
  },
};

const numberFormatType: CustomControlItem = {
  name: 'number_format_type',
  config: {
    type: 'SelectControl',
    label: t('Number Format'),
    renderTrigger: true,
    clearable: false,
    default: 'smart',
    options: NUMBER_FORMAT_PRESETS,
    description: t('How to format the number value'),
  },
};

const customNumberFormat: CustomControlItem = {
  name: 'custom_number_format',
  config: {
    type: 'TextControl',
    label: t('Custom D3 Format'),
    renderTrigger: true,
    default: ',.2f',
    description: `${t('D3 format string for custom formatting.')} ${D3_FORMAT_DOCS}`,
    visibility: ({ controls }) => controls?.number_format_type?.value === 'custom',
  },
};

const numberPrefix: CustomControlItem = {
  name: 'number_prefix',
  config: {
    type: 'TextControl',
    label: t('Prefix'),
    renderTrigger: true,
    default: '',
    description: t('Text to show before the number (e.g., "$", "Revenue: ")'),
  },
};

const numberSuffix: CustomControlItem = {
  name: 'number_suffix',
  config: {
    type: 'TextControl',
    label: t('Suffix'),
    renderTrigger: true,
    default: '',
    description: t('Text to show after the number (e.g., " UZS", "%", " users")'),
  },
};

const numberLocale: CustomControlItem = {
  name: 'number_locale',
  config: {
    type: 'SelectControl',
    label: t('Number Locale'),
    renderTrigger: true,
    clearable: false,
    default: 'ru',
    options: LOCALE_OPTIONS,
    description: t('Locale for number formatting (affects decimal/thousands separators)'),
  },
};

const defaultColor: CustomControlItem = {
  name: 'default_color',
  config: {
    type: 'ColorPickerControl',
    label: t('Default Color'),
    renderTrigger: true,
    default: { r: 51, g: 51, b: 51, a: 1 }, // #333333
    description: t('Default color for the number when no threshold is matched'),
  },
};

export default {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['metric'],
        ['adhoc_filters'],
      ],
    },
    {
      label: t('Display'),
      expanded: true,
      controlSetRows: [
        [headerFontSize],
        [showMetricName],
        [metricNameFontSize],
        [subtitle],
        [subtitleFontSize],
      ],
    },
    {
      label: t('Number Formatting'),
      expanded: true,
      controlSetRows: [
        [numberFormatType],
        [customNumberFormat],
        [numberLocale],
        [numberPrefix, numberSuffix],
      ],
    },
    {
      label: t('Colors'),
      expanded: true,
      controlSetRows: [
        [defaultColor],
        [
          {
            name: 'conditional_formatting',
            config: {
              type: 'ConditionalFormattingControl',
              renderTrigger: true,
              label: t('Conditional Formatting'),
              description: t(
                'Apply conditional color formatting based on value thresholds. ' +
                'Define rules to change the number color based on its value.',
              ),
              shouldMapStateToProps() {
                return true;
              },
              mapStateToProps(explore, _, chart) {
                const verboseMap = explore?.datasource?.hasOwnProperty(
                  'verbose_map',
                )
                  ? (explore?.datasource as Dataset)?.verbose_map
                  : (explore?.datasource?.columns ?? {});
                const { colnames, coltypes } =
                  chart?.queriesResponse?.[0] ?? {};
                const numericColumns =
                  Array.isArray(colnames) && Array.isArray(coltypes)
                    ? colnames
                        .filter(
                          (_: string, index: number) =>
                            coltypes[index] === GenericDataType.Numeric,
                        )
                        .map((colname: string | number) => ({
                          value: colname,
                          label:
                            (Array.isArray(verboseMap)
                              ? verboseMap[colname as number]
                              : verboseMap[colname as string]) ?? colname,
                          dataType:
                            colnames && coltypes[colnames?.indexOf(colname)],
                        }))
                    : [];
                return {
                  columnOptions: numericColumns,
                  verboseMap,
                };
              },
            },
          },
        ],
      ],
    },
  ],
  controlOverrides: {
    y_axis_format: {
      label: t('Number format'),
    },
  },
  formDataOverrides: (formData: any) => ({
    ...formData,
    metric: getStandardizedControls().shiftMetric(),
  }),
} as ControlPanelConfig;
