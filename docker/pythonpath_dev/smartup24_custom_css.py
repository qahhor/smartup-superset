# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
"""
Smartup24 Custom CSS Overrides
==============================

This module provides additional CSS customizations that extend beyond
what Ant Design tokens can configure. Use this for fine-grained control
over specific Superset components.

Usage:
    Add to your superset_config.py:
    from smartup24_custom_css import EXTRA_CUSTOM_CSS
    CUSTOM_CSS = EXTRA_CUSTOM_CSS
"""

# =============================================================================
# SMARTUP24 CUSTOM CSS
# =============================================================================

EXTRA_CUSTOM_CSS = """
/* ==========================================================================
   SMARTUP24 CUSTOM STYLES
   ========================================================================== */

/* --------------------------------------------------------------------------
   CSS Variables (Design Tokens)
   --------------------------------------------------------------------------
   These variables can be overridden in Ant Design theme or used directly.
   They provide fallback values for custom components.
   -------------------------------------------------------------------------- */

:root {
  /* Brand Colors (from smartup_24_cutguide.pdf) */
  --smartup24-primary: #2ECC71;
  --smartup24-primary-hover: #27AE60;
  --smartup24-primary-active: #229954;
  --smartup24-secondary: #009EE0;
  --smartup24-accent: #2ECC71;
  --smartup24-black: #1A1A1A;

  /* Semantic Colors */
  --smartup24-success: #2ECC71;
  --smartup24-warning: #F5A623;
  --smartup24-error: #E74C3C;
  --smartup24-info: #009EE0;

  /* Neutrals */
  --smartup24-bg-base: #FFFFFF;
  --smartup24-bg-elevated: #F9FAFB;
  --smartup24-bg-container: #FFFFFF;
  --smartup24-border: #E5E7EB;
  --smartup24-text-primary: #111827;
  --smartup24-text-secondary: #6B7280;
  --smartup24-text-disabled: #9CA3AF;

  /* Shadows */
  --smartup24-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --smartup24-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --smartup24-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --smartup24-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

  /* Transitions */
  --smartup24-transition-fast: 150ms ease;
  --smartup24-transition-normal: 200ms ease;
  --smartup24-transition-slow: 300ms ease;
}

/* Dark Mode Variables */
[data-theme="dark"],
.ant-theme-dark {
  --smartup24-bg-base: #111827;
  --smartup24-bg-elevated: #1F2937;
  --smartup24-bg-container: #1F2937;
  --smartup24-border: #374151;
  --smartup24-text-primary: #F9FAFB;
  --smartup24-text-secondary: #9CA3AF;
  --smartup24-text-disabled: #6B7280;
}

/* --------------------------------------------------------------------------
   Navigation & Header
   -------------------------------------------------------------------------- */

/* Main Navigation Bar */
.navbar,
.ant-layout-header {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Logo Container */
.navbar-brand,
.brand-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Navigation Links */
.navbar .nav-link,
.ant-menu-item a {
  font-weight: 500;
  transition: color var(--smartup24-transition-fast);
}

/* --------------------------------------------------------------------------
   Dashboard Styles
   -------------------------------------------------------------------------- */

/* Dashboard Container */
.dashboard {
  background-color: var(--smartup24-bg-base);
}

/* Dashboard Header */
.dashboard-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--smartup24-border);
}

/* Dashboard Title */
.dashboard-title,
.header-title {
  font-weight: 600;
  letter-spacing: -0.02em;
}

/* Dashboard Grid */
.grid-container {
  padding: 16px;
  gap: 16px;
}

/* --------------------------------------------------------------------------
   Chart Cards
   -------------------------------------------------------------------------- */

/* Chart Container */
.chart-container,
.slice-container {
  background: var(--smartup24-bg-container);
  border-radius: 8px;
  border: 1px solid var(--smartup24-border);
  box-shadow: var(--smartup24-shadow-sm);
  transition: box-shadow var(--smartup24-transition-normal);
  overflow: hidden;
}

.chart-container:hover,
.slice-container:hover {
  box-shadow: var(--smartup24-shadow);
}

/* Chart Header */
.chart-header,
.slice-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--smartup24-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Chart Title */
.chart-header-title,
.slice-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--smartup24-text-primary);
  margin: 0;
}

/* Chart Body */
.chart-body,
.slice-cell {
  padding: 16px;
}

/* --------------------------------------------------------------------------
   Filter Bar
   -------------------------------------------------------------------------- */

/* Native Filter Bar */
.filter-bar,
.nativeFilter {
  background: var(--smartup24-bg-elevated);
  border-right: 1px solid var(--smartup24-border);
}

/* Filter Title */
.filter-bar__title {
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--smartup24-text-secondary);
  margin-bottom: 8px;
}

/* Filter Items */
.filter-bar__item {
  margin-bottom: 16px;
}

/* --------------------------------------------------------------------------
   SQL Lab Styles
   -------------------------------------------------------------------------- */

/* SQL Editor Container */
.SqlLab,
.sql-lab {
  background: var(--smartup24-bg-base);
}

/* Query Editor */
.ace_editor,
.sql-editor {
  font-family: 'Fira Code', 'JetBrains Mono', monospace !important;
  font-size: 13px !important;
  line-height: 1.6 !important;
}

/* Results Table */
.sql-results-table {
  font-size: 13px;
}

.sql-results-table th {
  font-weight: 600;
  background: var(--smartup24-bg-elevated);
  position: sticky;
  top: 0;
}

/* Schema Browser */
.schema-browser {
  background: var(--smartup24-bg-elevated);
  border-right: 1px solid var(--smartup24-border);
}

/* --------------------------------------------------------------------------
   Explore (Chart Builder) Styles
   -------------------------------------------------------------------------- */

/* Control Panel */
.explore-controls,
.control-panel {
  background: var(--smartup24-bg-container);
  border-right: 1px solid var(--smartup24-border);
}

/* Control Section */
.control-section {
  padding: 16px;
  border-bottom: 1px solid var(--smartup24-border);
}

/* Control Label */
.control-label {
  font-weight: 500;
  font-size: 12px;
  color: var(--smartup24-text-secondary);
  margin-bottom: 6px;
}

/* --------------------------------------------------------------------------
   Tables & Data Grids
   -------------------------------------------------------------------------- */

/* Ant Design Table Overrides */
.ant-table {
  font-size: 13px;
}

.ant-table-thead > tr > th {
  font-weight: 600;
  background: var(--smartup24-bg-elevated) !important;
  border-bottom: 2px solid var(--smartup24-border);
}

.ant-table-tbody > tr:hover > td {
  background: var(--smartup24-bg-elevated) !important;
}

/* Striped Rows */
.ant-table-tbody > tr:nth-child(even) > td {
  background: rgba(0, 0, 0, 0.02);
}

[data-theme="dark"] .ant-table-tbody > tr:nth-child(even) > td {
  background: rgba(255, 255, 255, 0.02);
}

/* --------------------------------------------------------------------------
   Forms & Inputs
   -------------------------------------------------------------------------- */

/* Input Fields */
.ant-input,
.ant-select-selector,
.ant-picker {
  border-radius: 6px !important;
}

.ant-input:focus,
.ant-input-focused,
.ant-select-focused .ant-select-selector,
.ant-picker-focused {
  border-color: var(--smartup24-primary) !important;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1) !important;
}

/* Labels */
.ant-form-item-label > label {
  font-weight: 500;
}

/* --------------------------------------------------------------------------
   Buttons
   -------------------------------------------------------------------------- */

/* Primary Button */
.ant-btn-primary {
  font-weight: 500;
  box-shadow: none;
}

.ant-btn-primary:hover {
  box-shadow: var(--smartup24-shadow-sm);
}

/* Secondary/Default Button */
.ant-btn-default {
  font-weight: 500;
}

/* Button Groups */
.ant-btn-group .ant-btn {
  border-radius: 0;
}

.ant-btn-group .ant-btn:first-child {
  border-radius: 6px 0 0 6px;
}

.ant-btn-group .ant-btn:last-child {
  border-radius: 0 6px 6px 0;
}

/* --------------------------------------------------------------------------
   Cards & Panels
   -------------------------------------------------------------------------- */

.ant-card {
  border-radius: 8px;
  box-shadow: var(--smartup24-shadow-sm);
}

.ant-card-head {
  border-bottom: 1px solid var(--smartup24-border);
  font-weight: 600;
}

/* --------------------------------------------------------------------------
   Modals & Drawers
   -------------------------------------------------------------------------- */

.ant-modal-content {
  border-radius: 12px;
  overflow: hidden;
}

.ant-modal-header {
  border-bottom: 1px solid var(--smartup24-border);
}

.ant-modal-title {
  font-weight: 600;
}

.ant-drawer-content {
  border-radius: 0;
}

.ant-drawer-header {
  border-bottom: 1px solid var(--smartup24-border);
}

/* --------------------------------------------------------------------------
   Alerts & Notifications
   -------------------------------------------------------------------------- */

.ant-alert {
  border-radius: 8px;
}

.ant-message-notice-content {
  border-radius: 8px;
  box-shadow: var(--smartup24-shadow-lg);
}

.ant-notification-notice {
  border-radius: 8px;
}

/* --------------------------------------------------------------------------
   Tabs
   -------------------------------------------------------------------------- */

.ant-tabs-tab {
  font-weight: 500;
}

.ant-tabs-tab-active {
  font-weight: 600;
}

/* --------------------------------------------------------------------------
   Tags & Badges
   -------------------------------------------------------------------------- */

.ant-tag {
  border-radius: 4px;
  font-weight: 500;
}

.ant-badge-count {
  font-weight: 600;
}

/* --------------------------------------------------------------------------
   Loading States
   -------------------------------------------------------------------------- */

/* Skeleton */
.ant-skeleton-content .ant-skeleton-title,
.ant-skeleton-content .ant-skeleton-paragraph > li {
  border-radius: 4px;
}

/* Spinner/Loading */
.loading-indicator,
.ant-spin-dot {
  color: var(--smartup24-primary);
}

/* --------------------------------------------------------------------------
   Empty States
   -------------------------------------------------------------------------- */

.ant-empty-description {
  color: var(--smartup24-text-secondary);
}

/* --------------------------------------------------------------------------
   Tooltips
   -------------------------------------------------------------------------- */

.ant-tooltip-inner {
  border-radius: 6px;
  font-size: 12px;
}

/* --------------------------------------------------------------------------
   Dropdown Menus
   -------------------------------------------------------------------------- */

.ant-dropdown-menu {
  border-radius: 8px;
  box-shadow: var(--smartup24-shadow-lg);
  padding: 4px;
}

.ant-dropdown-menu-item {
  border-radius: 4px;
  margin: 2px 0;
}

/* --------------------------------------------------------------------------
   Scrollbars (WebKit browsers)
   -------------------------------------------------------------------------- */

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--smartup24-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--smartup24-text-disabled);
}

/* --------------------------------------------------------------------------
   Utility Classes
   -------------------------------------------------------------------------- */

/* Text Utilities */
.text-primary { color: var(--smartup24-primary) !important; }
.text-secondary { color: var(--smartup24-text-secondary) !important; }
.text-success { color: var(--smartup24-success) !important; }
.text-warning { color: var(--smartup24-warning) !important; }
.text-error { color: var(--smartup24-error) !important; }

/* Background Utilities */
.bg-primary { background-color: var(--smartup24-primary) !important; }
.bg-elevated { background-color: var(--smartup24-bg-elevated) !important; }

/* Border Utilities */
.border-primary { border-color: var(--smartup24-primary) !important; }

/* --------------------------------------------------------------------------
   Print Styles
   -------------------------------------------------------------------------- */

@media print {
  .navbar,
  .filter-bar,
  .chart-controls,
  .ant-btn {
    display: none !important;
  }

  .dashboard {
    background: white !important;
  }

  .chart-container {
    break-inside: avoid;
    box-shadow: none !important;
    border: 1px solid #ddd !important;
  }
}

/* --------------------------------------------------------------------------
   Responsive Adjustments
   -------------------------------------------------------------------------- */

@media (max-width: 768px) {
  .dashboard-header {
    padding: 12px 16px;
  }

  .grid-container {
    padding: 8px;
    gap: 8px;
  }

  .chart-header {
    padding: 8px 12px;
  }

  .chart-body {
    padding: 12px;
  }
}

/* ==========================================================================
   END SMARTUP24 CUSTOM STYLES
   ========================================================================== */
"""

# Shorter alias for convenience
CUSTOM_CSS = EXTRA_CUSTOM_CSS
