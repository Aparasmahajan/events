/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Server-side image optimization is disabled so that next/image lets the
    // browser fetch external URLs directly. This avoids the
    // UNABLE_TO_GET_ISSUER_CERT_LOCALLY TLS errors that hit on corporate
    // networks (proxies / MITM SSL interception) where Node's CA bundle
    // doesn't include the corporate root cert. The browser uses the OS cert
    // store, so it works regardless.
    //
    // For production, either keep this true (simplest), or set
    // NODE_EXTRA_CA_CERTS to your corporate root and flip this to false.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      // Local dev — files served from public/uploads/
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

module.exports = nextConfig;
