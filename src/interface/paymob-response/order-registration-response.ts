export interface IOrderRegistrationResponse {
    id: number,
    created_at: string,
    delivery_needed: string,
    merchant: IMerchant,
    collector: any,
    amount_cents: number,
    shipping_data: any,
    currency: string,
    is_payment_locked: string,
    merchant_order_id: any,
    wallet_notification: any,
    paid_amount_cents: number,
    items: any[]
}

export interface IMerchant {
    id: number,
    created_at: string,
    phones: string[],
    company_emails: string[],
    company_name: string,
    state: string,
    country: string,
    city: string,
    postal_code: string,
    street: string
}