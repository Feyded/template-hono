import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const UserRoleType = {
    SUPER_ADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    USER: "USER"
} as const;
export type UserRoleType = (typeof UserRoleType)[keyof typeof UserRoleType];
export const OrderPaymentMethod = {
    CASH: "CASH",
    GCASH: "GCASH",
    PAYMAYA: "PAYMAYA"
} as const;
export type OrderPaymentMethod = (typeof OrderPaymentMethod)[keyof typeof OrderPaymentMethod];
export const OrderStatus = {
    PENDING: "PENDING",
    PAID: "PAID",
    CANCELLED: "CANCELLED"
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export type orders = {
    id: Generated<string>;
    customer_name: string;
    payment_method: Generated<OrderPaymentMethod>;
    status: Generated<OrderStatus>;
    image_path: string | null;
    amount: number;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type users = {
    id: Generated<string>;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    role: Generated<UserRoleType>;
    is_active: Generated<boolean>;
    mobile_number: string;
    password: string;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type DB = {
    orders: orders;
    users: users;
};
