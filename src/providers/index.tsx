import { AuthProvider } from '@/providers/Auth'
import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client/react'
import { mollieAdapterClient } from '@/payments/mollie/client'
import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { SonnerProvider } from '@/providers/Sonner'

// Must match the server plugin config (src/plugins/index.ts); the client defaults to USD otherwise
const EUR = { code: 'EUR', decimals: 2, label: 'Euro', symbol: '€' }

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HeaderThemeProvider>
          <SonnerProvider />
          <EcommerceProvider
            currenciesConfig={{ defaultCurrency: 'EUR', supportedCurrencies: [EUR] }}
            enableVariants={true}
            api={{
              cartsFetchQuery: {
                depth: 2,
                populate: {
                  products: {
                    slug: true,
                    title: true,
                    gallery: true,
                    inventory: true,
                    priceInEUR: true,
                  },
                  variants: {
                    title: true,
                    inventory: true,
                    priceInEUR: true,
                  },
                },
              },
            }}
            paymentMethods={[mollieAdapterClient({ label: 'Mollie' })]}
          >
            {children}
          </EcommerceProvider>
        </HeaderThemeProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
