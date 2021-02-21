const colors = require('tailwindcss/colors')
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  purge: {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
  },
  darkMode: 'class',
  theme: {
    nightwind: {
      typography: true,
      colorClasses: ['placeholder', 'divide'],
    },
    fontFamily: {
      sans: ['Inter', ...fontFamily.sans],
    },
    extend: {
      spacing: {
        13: '3.25rem',
        26: '6.5rem',
        100: '25rem',
      },
      colors: {
        blueGray: colors.blueGray,
        coolGray: colors.coolGray,
        brand: colors.indigo,
        success: colors.green,
        danger: colors.red,
        warning: colors.yellow,
        info: colors.blue,
        normal: colors.gray,
        lightSurface: 'hsl(210, 20%, 98%)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            code: {
              // For inline codes
              // Ex: `Coderplex`
              padding: '3px 5px',
              borderRadius: 5,
            },
          },
        },
      }),
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('nightwind'),
  ],
}
