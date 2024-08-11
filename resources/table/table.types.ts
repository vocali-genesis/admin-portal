interface ColumnConfig<T> {
  title: string;
  dataIndex?: keyof T;
  render?: (item: T) => JSX.Element;
  sorter?: boolean;
}
