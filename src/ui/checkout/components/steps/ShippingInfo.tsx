import { useState } from 'react'

import type { Order } from '@/core/order'

import { Button } from '@/ui/components/ui/button'
import { Input } from '@/ui/components/ui/input'
import { Label } from '@/ui/components/ui/label'

type CheckoutShippingInfoStepProps = {
  shippingInfo?: Order.Details.ShippingInfo
  onSubmit: (shippingInfo: Order.Details.ShippingInfo) => void
  goBack: () => void
}

export function CheckoutShippingInfoStep({
  shippingInfo,
  onSubmit,
  goBack,
}: CheckoutShippingInfoStepProps) {
  const [address, setAddress] = useState(shippingInfo?.address ?? '')
  const [city, setCity] = useState(shippingInfo?.city ?? '')
  const [zipCode, setZipCode] = useState(shippingInfo?.zipCode ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      address: address.trim(),
      city: city.trim(),
      zipCode: zipCode.trim(),
    })
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Shipping Information</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="zipCode">Zip Code *</Label>
            <Input
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex space-x-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            className="flex-1"
          >
            Back
          </Button>

          <Button type="submit" className="flex-1">
            Continue to Payment
          </Button>
        </div>
      </form>
    </div>
  )
}
