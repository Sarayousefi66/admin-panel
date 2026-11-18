
export interface ProductPriceChartItem {
  title: string;
  price: number;
}

export interface UserStatusChartItem {
  status: string;
  value: number;
}

export interface DashboardStats {
  totalProducts: number;

  totalUsers: number;

  activeUsers: number;

  pendingUsers: number;

  productPrices: ProductPriceChartItem[];

  userStatusDistribution: UserStatusChartItem[];
}
