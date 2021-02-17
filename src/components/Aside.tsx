import { useEffect } from 'react'

export default function Aside() {
  useEffect(() => {
    const script = document.createElement('script')
    const form = document.getElementById('donateForm')
    script.setAttribute(
      'src',
      'https://checkout.razorpay.com/v1/payment-button.js'
    )
    script.setAttribute('data-payment_button_id', 'pl_GcZ4vmRP7KNpHf')
    form.appendChild(script)
  }, [])
  return (
    <div className="sticky top-4 space-y-4">
      <section aria-labelledby="trending-heading">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2
              id="trending-heading"
              className="text-base font-medium text-gray-900"
            >
              Donate To Coderplex
            </h2>
            <form id="donateForm"> </form>
          </div>
        </div>
      </section>
    </div>
  )
}
