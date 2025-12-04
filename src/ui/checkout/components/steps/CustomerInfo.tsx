import { useState } from 'react'

import type { Order } from '@/core/order'

import { Button } from '@/ui/components/ui/button'
import { Input } from '@/ui/components/ui/input'
import { Label } from '@/ui/components/ui/label'

type CheckoutCustomerInfoStepProps = {
  onSubmit: (customerInfo: Order.Details.CustomerInfo) => void
  customerInfo?: Order.Details.CustomerInfo
}

export function CheckoutCustomerInfoStep({
  onSubmit,
  customerInfo,
}: CheckoutCustomerInfoStepProps) {
  const [firstName, setFirstName] = useState(customerInfo?.firstName ?? '')
  const [lastName, setLastName] = useState(customerInfo?.lastName ?? '')
  const [email, setEmail] = useState(customerInfo?.email ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    })
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Customer Information</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full mt-6">
          Continue to Shipping
        </Button>
      </form>
    </div>
  )
}
