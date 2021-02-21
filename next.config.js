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
      {
        source: '/chat',
        destination: 'https://chat.coderplex.org',
        permanent: true,
      },
    ]
  },
}
