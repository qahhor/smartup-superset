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
import { useState, useEffect, useRef, MouseEvent } from 'react';
import { t, computeMaxFontSize } from '@superset-ui/core';
import { styled, useTheme } from '@apache-superset/core/ui';
import { SmartupKPIVizProps } from './types';

// Default formatter that just converts to string
const defaultFormatter = (value: number) => String(value);

// Proportion of container height for each element
const PROPORTION = {
  METRIC_NAME: 0.1,
  HEADER: 0.4,
  SUBTITLE: 0.125,
};

function SmartupKPIViz({
  className = '',
  width,
  height,
  bigNumber,
  metricName = '',
  showMetricName = true,
  subtitle = '',
  headerFontSize = PROPORTION.HEADER,
  subtitleFontSize = PROPORTION.SUBTITLE,
  metricNameFontSize = PROPORTION.METRIC_NAME,
  headerFormatter = defaultFormatter,
  numberColor,
  colorThresholdFormatters,
  onContextMenu,
}: SmartupKPIVizProps) {
  const theme = useTheme();

  // State for tracking if elements have rendered
  const [elementsRendered, setElementsRendered] = useState(false);

  // Refs for measuring element heights
  const metricNameRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  // Wait for elements to render before calculating heights
  useEffect(() => {
    const timeout = setTimeout(() => {
      setElementsRendered(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  // Re-render when dimensions change
  useEffect(() => {
    setElementsRendered(false);
    const timeout = setTimeout(() => {
      setElementsRendered(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, [width, height]);

  // Create temporary container for font size calculation
  const createTemporaryContainer = () => {
    const container = document.createElement('div');
    container.className = `smartup-kpi ${className}`;
    container.style.position = 'absolute';
    container.style.opacity = '0';
    return container;
  };

  // Get color based on conditional formatting thresholds
  const getNumberColor = (): string => {
    // Check conditional formatting thresholds
    if (
      Array.isArray(colorThresholdFormatters) &&
      colorThresholdFormatters.length > 0 &&
      bigNumber !== null &&
      typeof bigNumber === 'number'
    ) {
      for (const formatter of colorThresholdFormatters) {
        const formatterResult = formatter.getColorFromValue(bigNumber);
        if (formatterResult) {
          return formatterResult;
        }
      }
    }

    // Return custom default color or theme color
    return numberColor || theme.colors.text.label;
  };

  // Render metric name
  const renderMetricName = (maxHeight: number) => {
    if (!showMetricName || !metricName) return null;

    const text = metricName;

    const container = createTemporaryContainer();
    document.body.append(container);
    const fontSize = computeMaxFontSize({
      text,
      maxWidth: width * 0.95,
      maxHeight,
      className: 'smartup-kpi__metric-name',
      container,
    });
    container.remove();

    return (
      <div
        ref={metricNameRef}
        className="smartup-kpi__metric-name"
        style={{
          fontSize,
          height: 'auto',
        }}
      >
        {text}
      </div>
    );
  };

  // Render the main KPI number
  const renderHeader = (maxHeight: number) => {
    const text =
      bigNumber === null
        ? t('No data')
        : headerFormatter(bigNumber as number);

    const container = createTemporaryContainer();
    document.body.append(container);
    const fontSize = computeMaxFontSize({
      text,
      maxWidth: width * 0.95,
      maxHeight,
      className: 'smartup-kpi__header',
      container,
    });
    container.remove();

    const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
      if (onContextMenu) {
        e.preventDefault();
        onContextMenu(e.nativeEvent.clientX, e.nativeEvent.clientY);
      }
    };

    return (
      <div
        ref={headerRef}
        className="smartup-kpi__header"
        style={{
          fontSize,
          height: 'auto',
          color: getNumberColor(),
        }}
        onContextMenu={handleContextMenu}
      >
        {text}
      </div>
    );
  };

  // Render subtitle
  const renderSubtitle = (maxHeight: number) => {
    if (!subtitle) return null;

    const container = createTemporaryContainer();
    document.body.append(container);
    const fontSize = computeMaxFontSize({
      text: subtitle,
      maxWidth: width * 0.95,
      maxHeight,
      className: 'smartup-kpi__subtitle',
      container,
    });
    container.remove();

    return (
      <div
        ref={subtitleRef}
        className="smartup-kpi__subtitle"
        style={{
          fontSize,
          height: 'auto',
        }}
      >
        {subtitle}
      </div>
    );
  };

  // Calculate if content overflows
  const getTotalElementsHeight = () => {
    const marginPerElement = 8;
    const refs = [metricNameRef, headerRef, subtitleRef];
    const visibleRefs = refs.filter(ref => ref.current);

    return visibleRefs.reduce((sum, ref, index) => {
      const elemHeight = ref.current?.offsetHeight || 0;
      const margin = index < visibleRefs.length - 1 ? marginPerElement : 0;
      return sum + elemHeight + margin;
    }, 0);
  };

  const shouldApplyOverflow = () => {
    if (!elementsRendered) return false;
    const totalHeight = getTotalElementsHeight();
    return totalHeight > height;
  };

  const overflow = shouldApplyOverflow();

  return (
    <div
      className={`smartup-kpi ${className}`}
      style={{
        height,
        width,
        ...(overflow
          ? {
              display: 'block',
              boxSizing: 'border-box',
              overflowX: 'hidden',
              overflowY: 'auto',
            }
          : {}),
      }}
    >
      <div className="smartup-kpi__container">
        {renderMetricName(metricNameFontSize ? metricNameFontSize * height : 0)}
        {renderHeader(headerFontSize * height)}
        {renderSubtitle(subtitleFontSize * height)}
      </div>
    </div>
  );
}

// Styled component with Smartup24 brand styles
const StyledSmartupKPIViz = styled(SmartupKPIViz)`
  ${({ theme }) => `
    font-family: ${theme.fontFamily};
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: ${theme.gridUnit * 2}px;

    .smartup-kpi__container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      text-align: center;
    }

    .smartup-kpi__metric-name {
      color: ${theme.colors.text.label};
      font-weight: 400;
      line-height: 1.2;
      margin-bottom: ${theme.gridUnit * 2}px;
      text-transform: none;
      letter-spacing: 0;
    }

    .smartup-kpi__header {
      font-weight: 600;
      line-height: 1;
      margin-bottom: ${theme.gridUnit * 2}px;
      white-space: nowrap;
      transition: color 0.2s ease;
    }

    .smartup-kpi__subtitle {
      color: ${theme.colors.text.label};
      font-weight: 400;
      line-height: 1.3;
      margin-top: ${theme.gridUnit}px;
    }

    /* Animation for number updates */
    @keyframes smartup-pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }

    .smartup-kpi__header--updated {
      animation: smartup-pulse 0.3s ease-out;
    }
  `}
`;

export default StyledSmartupKPIViz;
