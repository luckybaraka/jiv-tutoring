export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const lastModified = new Date();
  return [
    { url: `${baseUrl}/`, lastModified, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified, priority: 0.8 },
    { url: `${baseUrl}/what-we-do`, lastModified, priority: 0.9 },
    { url: `${baseUrl}/news`, lastModified, priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified, priority: 0.7 },
    { url: `${baseUrl}/book`, lastModified, priority: 1.0 },
  ];
}
