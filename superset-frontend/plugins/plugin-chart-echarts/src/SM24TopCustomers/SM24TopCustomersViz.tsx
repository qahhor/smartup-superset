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
import { useCallback, useMemo, useState } from 'react';
import { styled } from '@superset-ui/core';
import {
  SM24TopCustomersVizProps,
  CustomerData,
  HEALTH_COLORS,
  SEGMENT_COLORS,
  getProductColor,
  formatDaysAgo,
} from './types';

// =============================================================================
// STYLED COMPONENTS
// =============================================================================

const Container = styled.div<{ height: number }>`
  display: flex;
  flex-direction: column;
  height: ${({ height }) => height}px;
  font-family: ${({ theme }) =>
    theme.typography?.families?.sansSerif || 'Inter, Helvetica, Arial, sans-serif'};
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  background: #fafafa;
`;

const SearchBox = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 250px;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const AlertBadge = styled.div<{ color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: ${({ color }) => color}15;
  color: ${({ color }) => color};
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

const Th = styled.th<{ sortable?: boolean; width?: number }>`
  position: sticky;
  top: 0;
  background: #f8f9fa;
  padding: 10px 12px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  white-space: nowrap;
  cursor: ${({ sortable }) => (sortable ? 'pointer' : 'default')};
  width: ${({ width }) => (width ? `${width}px` : 'auto')};
  user-select: none;

  &:hover {
    background: ${({ sortable }) => (sortable ? '#e9ecef' : '#f8f9fa')};
  }
`;

const Tr = styled.tr<{
  isAtRisk?: boolean;
  isRenewalUrgent?: boolean;
  isTopTen?: boolean;
}>`
  background: ${({ isRenewalUrgent }) => (isRenewalUrgent ? '#FFF9E6' : '#fff')};
  border-bottom: 1px solid #eee;

  &:hover {
    background: #f5f8fa;
  }

  ${({ isAtRisk }) =>
    isAtRisk &&
    `
    .customer-name {
      font-weight: 700;
    }
  `}
`;

const Td = styled.td<{ align?: 'left' | 'center' | 'right' }>`
  padding: 10px 12px;
  text-align: ${({ align }) => align || 'left'};
  vertical-align: middle;
`;

const CustomerNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StarIcon = styled.span`
  color: #f1c40f;
  font-size: 14px;
`;

const CustomerLink = styled.span<{ clickable?: boolean }>`
  color: ${({ clickable }) => (clickable ? '#3498db' : '#2c3e50')};
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  font-weight: 500;

  &:hover {
    text-decoration: ${({ clickable }) => (clickable ? 'underline' : 'none')};
  }
`;

const SegmentBadge = styled.span<{ color: string }>`
  display: inline-block;
  padding: 2px 6px;
  background: ${({ color }) => color}20;
  color: ${({ color }) => color};
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  margin-left: 6px;
`;

const GrowthCell = styled.span<{ positive?: boolean; negative?: boolean }>`
  color: ${({ positive, negative }) =>
    positive ? '#27AE60' : negative ? '#E74C3C' : '#95A5A6'};
  font-weight: 500;
`;

const ProductPill = styled.span<{ color: string }>`
  display: inline-block;
  padding: 2px 8px;
  background: ${({ color }) => color}20;
  color: ${({ color }) => color};
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
  margin-right: 4px;
  margin-bottom: 2px;
`;

const RegionCell = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const HealthBar = styled.div<{ score: number; color: string }>`
  width: 60px;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${({ score }) => score}%;
    background: ${({ color }) => color};
    border-radius: 4px;
  }
`;

const HealthCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RenewalCell = styled.div<{ urgent?: boolean; upcoming?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ urgent, upcoming }) =>
    urgent ? '#E74C3C' : upcoming ? '#F39C12' : '#2c3e50'};
  font-weight: ${({ urgent }) => (urgent ? '600' : 'normal')};
`;

const ActivityCell = styled.div<{ alert?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ alert }) => (alert ? '#E74C3C' : '#2c3e50')};
`;

const NpsBadge = styled.span<{ score: number }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ score }) =>
    score >= 50 ? '#27AE60' : score >= 0 ? '#F1C40F' : '#E74C3C'}20;
  color: ${({ score }) =>
    score >= 50 ? '#27AE60' : score >= 0 ? '#F1C40F' : '#E74C3C'};
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #eee;
  background: #fafafa;
  font-size: 12px;
  color: #666;
`;

const FooterStats = styled.div`
  display: flex;
  gap: 24px;
`;

const FooterStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FooterStatLabel = styled.span`
  color: #999;
  font-size: 10px;
  text-transform: uppercase;
`;

const FooterStatValue = styled.span<{ color?: string }>`
  font-weight: 600;
  font-size: 14px;
  color: ${({ color }) => color || '#2c3e50'};
`;

const QuickActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #f5f5f5;
    border-color: #ccc;
  }
`;

// =============================================================================
// MAIN COMPONENT
// =============================================================================

function SM24TopCustomersViz({
  className = '',
  width,
  height,
  customers,
  summary,
  columns,
  enableSearch,
  showFooterSummary,
  showConcentrationAlert,
  highlightAtRisk,
  highlightTopTen,
  highlightUrgentRenewals,
  formatCurrency,
  formatPercent,
  formatTenure,
  enableDrilldown,
  enableQuickActions,
  enableExport,
  onDrilldown,
}: SM24TopCustomersVizProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('totalArr');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter customers by search
  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter(
      c =>
        c.customerName.toLowerCase().includes(query) ||
        c.industry.toLowerCase().includes(query) ||
        c.region.toLowerCase().includes(query),
    );
  }, [customers, searchQuery]);

  // Sort customers
  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      let aVal: number | string = 0;
      let bVal: number | string = 0;

      switch (sortColumn) {
        case 'totalArr':
          aVal = a.totalArr;
          bVal = b.totalArr;
          break;
        case 'arrGrowthMom':
          aVal = a.arrGrowthMom ?? 0;
          bVal = b.arrGrowthMom ?? 0;
          break;
        case 'healthScore':
          aVal = a.healthScore;
          bVal = b.healthScore;
          break;
        case 'renewalDate':
          aVal = a.daysUntilRenewal;
          bVal = b.daysUntilRenewal;
          break;
        case 'customerName':
          aVal = a.customerName;
          bVal = b.customerName;
          break;
        case 'tenure':
          aVal = a.tenureMonths;
          bVal = b.tenureMonths;
          break;
        default:
          return 0;
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }

      return sortDirection === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [filteredCustomers, sortColumn, sortDirection]);

  // Handle sort click
  const handleSort = useCallback(
    (column: string) => {
      if (sortColumn === column) {
        setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortColumn(column);
        setSortDirection('desc');
      }
    },
    [sortColumn],
  );

  // Handle customer click
  const handleCustomerClick = useCallback(
    (customer: CustomerData) => {
      if (enableDrilldown && onDrilldown) {
        onDrilldown(customer.customerId, 'SM24-CustomerProfile');
      }
    },
    [enableDrilldown, onDrilldown],
  );

  // Render sort indicator
  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <Container className={`sm24-top-customers ${className}`} height={height}>
      {/* Header */}
      <Header>
        {enableSearch && (
          <SearchBox
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        )}

        {showConcentrationAlert && (
          <AlertBadge color="#E74C3C">
            ⚠️ High Concentration: Top 10 = {summary.topTenConcentration.toFixed(1)}% of ARR
          </AlertBadge>
        )}

        {summary.criticalRenewals > 0 && (
          <AlertBadge color="#E74C3C">
            🔴 {summary.criticalRenewals} Critical Renewals
          </AlertBadge>
        )}

        {summary.upcomingRenewals > 0 && (
          <AlertBadge color="#F39C12">
            🟡 {summary.upcomingRenewals} Upcoming Renewals
          </AlertBadge>
        )}
      </Header>

      {/* Table */}
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th width={50}>#</Th>
              <Th sortable onClick={() => handleSort('customerName')}>
                Customer{renderSortIndicator('customerName')}
              </Th>
              <Th sortable width={120} onClick={() => handleSort('totalArr')}>
                ARR{renderSortIndicator('totalArr')}
              </Th>
              <Th sortable width={90} onClick={() => handleSort('arrGrowthMom')}>
                MoM{renderSortIndicator('arrGrowthMom')}
              </Th>
              <Th width={180}>Products</Th>
              <Th width={120}>Industry</Th>
              <Th width={120}>Region</Th>
              <Th sortable width={100} onClick={() => handleSort('tenure')}>
                Tenure{renderSortIndicator('tenure')}
              </Th>
              <Th sortable width={120} onClick={() => handleSort('healthScore')}>
                Health{renderSortIndicator('healthScore')}
              </Th>
              <Th sortable width={110} onClick={() => handleSort('renewalDate')}>
                Renewal{renderSortIndicator('renewalDate')}
              </Th>
              <Th width={120}>CSM</Th>
              <Th width={100}>Activity</Th>
              <Th width={70}>NPS</Th>
            </tr>
          </thead>
          <tbody>
            {sortedCustomers.map(customer => (
              <Tr
                key={customer.customerId}
                isAtRisk={highlightAtRisk && customer.isAtRisk}
                isRenewalUrgent={highlightUrgentRenewals && customer.isRenewalUrgent}
                isTopTen={highlightTopTen && customer.isTopTen}
              >
                <Td align="center">{customer.rank}</Td>
                <Td>
                  <CustomerNameCell>
                    {highlightTopTen && customer.isTopTen && <StarIcon>⭐</StarIcon>}
                    <CustomerLink
                      className="customer-name"
                      clickable={enableDrilldown}
                      onClick={() => handleCustomerClick(customer)}
                    >
                      {customer.customerName}
                    </CustomerLink>
                    <SegmentBadge color={SEGMENT_COLORS[customer.segment]}>
                      {customer.segment.toUpperCase()}
                    </SegmentBadge>
                    {customer.isExpansionCandidate && (
                      <span title="Expansion Candidate">🟢</span>
                    )}
                    {customer.isDisengaged && <span title="Disengaged">🚩</span>}
                  </CustomerNameCell>
                </Td>
                <Td align="right">
                  <strong>{formatCurrency(customer.totalArr)}</strong>
                </Td>
                <Td align="right">
                  <GrowthCell
                    positive={customer.arrGrowthMom !== null && customer.arrGrowthMom > 0}
                    negative={customer.arrGrowthMom !== null && customer.arrGrowthMom < 0}
                  >
                    {customer.arrGrowthMom !== null && customer.arrGrowthMom > 0 && '↑'}
                    {customer.arrGrowthMom !== null && customer.arrGrowthMom < 0 && '↓'}
                    {formatPercent(customer.arrGrowthMom)}
                  </GrowthCell>
                </Td>
                <Td>
                  {customer.products.map(product => (
                    <ProductPill key={product} color={getProductColor(product)}>
                      {product}
                    </ProductPill>
                  ))}
                </Td>
                <Td>{customer.industry}</Td>
                <Td>
                  <RegionCell>
                    <span>{customer.regionFlag}</span>
                    {customer.region}
                  </RegionCell>
                </Td>
                <Td>{formatTenure(customer.tenureMonths)}</Td>
                <Td>
                  <HealthCell>
                    <HealthBar
                      score={customer.healthScore}
                      color={HEALTH_COLORS[customer.healthLevel]}
                    />
                    <span>{customer.healthScore}</span>
                  </HealthCell>
                </Td>
                <Td>
                  <RenewalCell
                    urgent={customer.daysUntilRenewal < 30}
                    upcoming={customer.daysUntilRenewal < 90}
                  >
                    {customer.daysUntilRenewal < 0
                      ? 'Overdue'
                      : `${customer.daysUntilRenewal}d`}
                  </RenewalCell>
                </Td>
                <Td>{customer.accountManager || '—'}</Td>
                <Td>
                  <ActivityCell alert={customer.daysSinceActivity > 30}>
                    {customer.daysSinceActivity > 30 && '🔴'}
                    {formatDaysAgo(customer.daysSinceActivity)}
                  </ActivityCell>
                </Td>
                <Td align="center">
                  {customer.npsScore !== null ? (
                    <NpsBadge score={customer.npsScore}>{customer.npsScore}</NpsBadge>
                  ) : (
                    '—'
                  )}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      {/* Footer */}
      {showFooterSummary && (
        <Footer>
          <FooterStats>
            <FooterStat>
              <FooterStatLabel>Total ARR</FooterStatLabel>
              <FooterStatValue>{formatCurrency(summary.totalARR)}</FooterStatValue>
            </FooterStat>
            <FooterStat>
              <FooterStatLabel>Customers</FooterStatLabel>
              <FooterStatValue>{summary.totalCustomers}</FooterStatValue>
            </FooterStat>
            <FooterStat>
              <FooterStatLabel>Avg Health</FooterStatLabel>
              <FooterStatValue
                color={
                  summary.averageHealthScore >= 80
                    ? '#27AE60'
                    : summary.averageHealthScore >= 60
                    ? '#F1C40F'
                    : '#E74C3C'
                }
              >
                {summary.averageHealthScore.toFixed(0)}
              </FooterStatValue>
            </FooterStat>
            <FooterStat>
              <FooterStatLabel>At Risk</FooterStatLabel>
              <FooterStatValue color={summary.customersAtRisk > 0 ? '#E74C3C' : '#27AE60'}>
                {summary.customersAtRisk}
              </FooterStatValue>
            </FooterStat>
          </FooterStats>

          {enableQuickActions && (
            <QuickActions>
              {enableExport && <ActionButton>📥 Export</ActionButton>}
              <ActionButton>📋 Copy</ActionButton>
            </QuickActions>
          )}
        </Footer>
      )}
    </Container>
  );
}

export default SM24TopCustomersViz;
