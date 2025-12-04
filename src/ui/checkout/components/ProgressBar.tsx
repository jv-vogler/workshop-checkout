import { Checkout } from '@/core/checkout'

type CheckoutProgressBarProps = {
  step: Checkout.Step
}

export function CheckoutProgressBar({ step }: CheckoutProgressBarProps) {
  const currentStepIndex = Checkout.steps.indexOf(step)

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span
          className={`text-sm ${currentStepIndex >= Checkout.steps.indexOf('CUSTOMER_INFO') ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}
        >
          Customer Info
        </span>
        <span
          className={`text-sm ${currentStepIndex >= Checkout.steps.indexOf('SHIPPING_INFO') ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}
        >
          Shipping
        </span>
        <span
          className={`text-sm ${currentStepIndex >= Checkout.steps.indexOf('PAYMENT_INFO') ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}
        >
          Payment
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentStepIndex + 1) / (Checkout.steps.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}
