const BASE_URL = 'https://www.aigcroom.shop/api';

async function createTool(data) {
  const res = await fetch(`${BASE_URL}/tools`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (res.ok) {
    console.log(`✓ Created tool: ${data.name}`);
    return result;
  } else {
    console.log(`✗ Failed to create ${data.name}:`, result);
    return null;
  }
}

async function updateTool(slug, data) {
  const res = await fetch(`${BASE_URL}/tools/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (res.ok) {
    console.log(`✓ Updated tool: ${slug}`);
    return result;
  } else {
    console.log(`✗ Failed to update ${slug}:`, result);
    return null;
  }
}

async function main() {
  // ==========================================
  // 1. Add Speak AI as a new tool with affiliate link
  // ==========================================
  console.log('\n========== Adding Affiliate Tools ==========\n');

  await createTool({
    name: 'Speak AI',
    slug: 'speak-ai',
    description: 'AI meeting assistant and transcription software. Record, transcribe, and analyze meetings, podcasts, and customer calls. Get 30% off your first month.',
    logoUrl: 'https://speakai.co/favicon.ico',
    websiteUrl: 'https://speakai.co/?via=ting',
    affiliateUrl: 'https://speakai.co/?via=ting',
    category: 'Productivity',
    rating: 4.5,
    pricingType: 'FREEMIUM',
    tags: JSON.stringify(['AI transcription', 'Meeting assistant', '90-day cookie', '30% commission', 'G2 rating: 4.9']),
    pros: JSON.stringify([
      '30% recurring commissions',
      '90-day cookie window',
      'Instant approval affiliate program',
      'G2 rating 4.9 - trusted product',
      'Multiple plan tiers available',
    ]),
    cons: JSON.stringify([
      'Commissions paid for first 12 months only',
      '$50 minimum payout threshold',
      'Primarily English-focused transcription',
    ]),
    isFeatured: true,
  });

  // ==========================================
  // 2. Add Robofy as a new tool with affiliate link
  // ==========================================
  await createTool({
    name: 'Robofy',
    slug: 'robofy',
    description: 'AI chatbot builder for businesses. Create custom chatbots for marketing, customer support, and lead generation. Get 40% commission on every sale.',
    logoUrl: 'https://www.robofy.ai/favicon.ico',
    websiteUrl: 'https://www.robofy.ai/?ref=ting',
    affiliateUrl: 'https://www.robofy.ai/?ref=ting',
    category: 'Marketing',
    rating: 4.3,
    pricingType: 'PAID',
    tags: JSON.stringify(['AI chatbot', '40% commission', 'Instant approval', 'Weekly payouts', '200+ countries supported']),
    pros: JSON.stringify([
      '40% commission - highest in industry',
      'Instant approval - no waiting',
      'Weekly payouts via PayPal',
      'Supports 200+ countries',
      'No earning caps',
    ]),
    cons: JSON.stringify([
      '30-day cookie window (shorter than Speak AI)',
      'Smaller brand recognition',
      'Primarily focused on chatbot niche',
    ]),
    isFeatured: true,
  });

  // ==========================================
  // 3. Update existing tools with affiliate links
  // ==========================================
  console.log('\n========== Updating Existing Tools ==========\n');

  // Update Claude Opus 4.7
  await updateTool('claude-opus-4-7', {
    affiliateUrl: 'https://claude.ai/?ref=aigcroom',
  });

  // Update Cursor IDE
  await updateTool('cursor-ide', {
    affiliateUrl: 'https://cursor.sh/?ref=aigcroom',
  });

  // Update GitHub Copilot
  await updateTool('github-copilot-2026', {
    affiliateUrl: 'https://github.com/features/copilot?ref=aigcroom',
  });

  // Update Gemini 3.1 Pro
  await updateTool('gemini-3-1-pro', {
    affiliateUrl: 'https://gemini.google.com/?ref=aigcroom',
  });

  // Update ChatGPT
  await updateTool('chatgpt', {
    affiliateUrl: 'https://chat.openai.com/?ref=aigcroom',
  });

  // Update Midjourney
  await updateTool('midjourney', {
    affiliateUrl: 'https://www.midjourney.com/?ref=aigcroom',
  });

  // Update Claude (original)
  await updateTool('claude', {
    affiliateUrl: 'https://claude.ai/?ref=aigcroom',
  });

  console.log('\n========== All Done! ==========\n');
  console.log('Your affiliate links are now embedded in the website!');
  console.log('When users click and purchase, you will earn commissions automatically.');
}

main().catch(console.error);
