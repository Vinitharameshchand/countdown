import React, { useMemo } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFinance } from '@/contexts/FinanceContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthProvider';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const screenWidth = Dimensions.get('window').width;

const SummaryCard = ({ title, amount, icon, color, trend, symbol }: any) => {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <ThemedView style={[styles.card, { borderColor: color + '30' }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
          <IconSymbol name={icon} size={20} color={color} />
        </View>
        <ThemedText style={styles.cardTitle}>{title}</ThemedText>
      </View>
      <View style={styles.cardBody}>
        <ThemedText style={styles.amount}>
          {symbol}{amount.toLocaleString()}
        </ThemedText>
        {trend !== undefined && (
          <ThemedText style={[styles.trend, { color: trend > 0 ? '#10b981' : '#ef4444' }]}>
            {trend > 0 ? '+' : ''}{trend}% from last month
          </ThemedText>
        )}
      </View>
    </ThemedView>
  );
};

export default function DashboardScreen() {
  const { incomes, expenses, loans, loading } = useFinance();
  const { currency } = useCurrency();
  const { signOut, user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';

  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0) || 5000;
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0) || 1200;
  const totalLoanBalance = loans.reduce((acc, curr) => acc + curr.remainingBalance, 0) || 45000;
  const totalEMI = loans.reduce((acc, curr) => acc + curr.emi, 0) || 450;

  const healthScore = useMemo(() => {
    if (totalIncome <= 0) return 0;
    let score = 100;
    score -= (50 * totalEMI / totalIncome);
    score -= (30 * totalExpense / totalIncome);
    return Math.max(0, Math.round(score));
  }, [totalIncome, totalEMI, totalExpense]);

  const chartConfig = {
    backgroundGradientFrom: Colors[colorScheme].background,
    backgroundGradientTo: Colors[colorScheme].background,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => colorScheme === 'dark' ? `rgba(248, 250, 252, ${opacity})` : `rgba(17, 24, 28, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const barData = {
    labels: ['Income', 'Expenses', 'EMI'],
    datasets: [
      {
        data: [totalIncome, totalExpense, totalEMI],
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <View>
          <ThemedText type="title">Financial Overview</ThemedText>
          <ThemedText style={styles.subtitle}>Welcome back, {user?.name || 'Alice'}</ThemedText>
        </View>
        <TouchableOpacity onPress={signOut}>
          <IconSymbol name="person.fill" size={24} color={Colors[colorScheme].tint} />
        </TouchableOpacity>
      </ThemedView>

      <View style={styles.summaryGrid}>
        <SummaryCard 
          title="Income" 
          amount={totalIncome} 
          icon="chart.bar.fill" 
          color="#10b981" 
          trend={12} 
          symbol={currency.symbol}
        />
        <SummaryCard 
          title="Spending" 
          amount={totalExpense} 
          icon="chart.pie.fill" 
          color="#ef4444" 
          trend={-5} 
          symbol={currency.symbol}
        />
        <SummaryCard 
          title="Debt" 
          amount={totalLoanBalance} 
          icon="calculator.fill" 
          color="#3b82f6" 
          symbol={currency.symbol}
        />
        <View style={[styles.card, styles.healthCard, { borderColor: Colors[colorScheme].tint + '50' }]}>
          <View style={styles.healthCircle}>
             <ThemedText style={styles.healthScoreText}>{healthScore}</ThemedText>
             <ThemedText style={styles.healthLabel}>Score</ThemedText>
          </View>
          <View>
            <ThemedText style={styles.healthStatus}>
              {healthScore > 70 ? 'Excellent' : healthScore > 40 ? 'Good' : 'Revision'}
            </ThemedText>
            <ThemedText style={styles.healthSubLabel}>Loan Health</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <ThemedText style={styles.sectionTitle}>Overview Chart</ThemedText>
        <BarChart
          data={barData}
          width={screenWidth - 48}
          height={220}
          yAxisLabel={currency.symbol}
          yAxisSuffix=""
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          style={styles.chart}
        />
      </View>

      <View style={styles.loansSection}>
        <ThemedText style={styles.sectionTitle}>Active Loans</ThemedText>
        {loans.length > 0 ? (
          loans.map(loan => (
            <ThemedView key={loan._id} style={styles.loanItem}>
              <ThemedText>Loan Account</ThemedText>
              <ThemedText style={styles.loanAmount}>
                {currency.symbol}{loan.remainingBalance.toLocaleString()}
              </ThemedText>
            </ThemedView>
          ))
        ) : (
          <ThemedText style={styles.placeholderText}>No active loans found.</ThemedText>
        )}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  card: {
    width: (screenWidth - 48 - 16) / 2,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(22, 28, 46, 0.4)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
  trend: {
    fontSize: 10,
    marginTop: 4,
  },
  healthCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  healthCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthScoreText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10b981',
  },
  healthLabel: {
    fontSize: 8,
    color: '#94a3b8',
  },
  healthStatus: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
  },
  healthSubLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
  chartContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: 'serif',
  },
  chart: {
    borderRadius: 16,
    paddingRight: 0,
  },
  loansSection: {
    marginBottom: 32,
  },
  loanItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 8,
    backgroundColor: 'rgba(22, 28, 46, 0.4)',
  },
  loanAmount: {
    fontWeight: '700',
    color: '#10b981',
  },
  placeholderText: {
    color: '#94a3b8',
    fontStyle: 'italic',
  }
});
