module.exports = {
  images: {
    domains: [],
  },
  async redirects() {
    return [
      {
        source: '/markdown',
        destination:
          'https://github.com/coderplex-org/coderplex-org/wiki/Markdown-Guide',
        permanent: false,
      },
    ]
  },
}
