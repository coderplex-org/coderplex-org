import { useEffect } from 'react'

export default function Donate() {
  useEffect(() => {
    const script = document.createElement('script')
    const form = document.getElementById('donateForm')
    script.setAttribute(
      'src',
      'https://cdn.razorpay.com/static/widget/subscription-button.js'
    )
    script.setAttribute('data-subscription_button_id', 'pl_GdSwtlH5wuoiJS')
    script.setAttribute('data-button_theme', 'brand-color')
    form.appendChild(script)
  }, [])

  return (
    <>
      <form id="donateForm"> </form>
    </>
  )
}
