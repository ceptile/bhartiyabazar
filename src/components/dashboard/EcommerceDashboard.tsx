'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  createEcommerceProduct,
  getBusinessEcommerceProducts,
  deleteEcommerceProduct,
  updateEcommerceProduct,
  fetchProductFromUrl,
  validateProductUrl,
  detectPlatform,
  PLATFORMS,
} from '@/lib/ecommerce';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

function Icon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function EcommerceDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    currency: 'INR',
    category: '',
    brand: '',
    tags: '',
    inStock: true,
    stockCount: '',
    featured: false,
    sourceUrl: '',
    imageUrl: '',
    images: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlValidation, setUrlValidation] = useState<any>(null);

  const CATEGORIES = [
    'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty & Personal Care',
    'Sports & Fitness', 'Books & Stationery', 'Toys & Games', 'Automotive',
    'Health & Wellness', 'Food & Grocery', 'Mobile Accessories', 'Computers & Accessories',
    'Camera & Photography', 'Watches & Accessories', 'Jewellery', 'Furniture',
    'Baby & Kids', 'Pet Supplies', 'Garden & Outdoor', 'Other',
  ];

  useEffect(() => {
    if (user && user.businessSlug) {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadProducts = async () => {
    if (!user?.businessSlug) return;
    try {
      const businessProducts = await getBusinessEcommerceProducts(user.businessSlug);
      setProducts(businessProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlFetch = async () => {
    if (!form.sourceUrl) return;

    const validation = validateProductUrl(form.sourceUrl);
    setUrlValidation(validation);

    if (!validation.valid) {
      return;
    }

    setFetching(true);
    try {
      const productData = await fetchProductFromUrl(form.sourceUrl);
      if (productData) {
        setForm({
          ...form,
          title: productData.title,
          description: productData.description,
          price: productData.price.toString(),
          originalPrice: productData.originalPrice?.toString() || '',
          currency: productData.currency,
          category: productData.category,
          brand: productData.brand || '',
          imageUrl: productData.imageUrl,
          images: productData.images,
          inStock: productData.inStock,
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to fetch product details. Please enter them manually.');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (!user) return;

    try {
      const productData = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price) || 0,
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        currency: form.currency,
        imageUrl: form.imageUrl,
        images: form.images,
        sourceUrl: form.sourceUrl,
        platform: detectPlatform(form.sourceUrl) || 'Other',
        category: form.category,
        tags: form.tags.split(',').map(t => t.trim()).filter(t => t),
        brand: form.brand || undefined,
        inStock: form.inStock,
        stockCount: form.stockCount ? parseInt(form.stockCount) : undefined,
        businessSlug: user.businessSlug || '',
        businessName: user.businessName || '',
        postedBy: user.id,
        city: user.city || '',
        featured: form.featured,
        active: true,
      };

      await createEcommerceProduct(productData);
      setShowForm(false);
      resetForm();
      await loadProducts();
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteEcommerceProduct(productId);
      await loadProducts();
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleToggleFeatured = async (productId: string, currentFeatured: boolean) => {
    try {
      await updateEcommerceProduct(productId, { featured: !currentFeatured });
      await loadProducts();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const handleToggleActive = async (productId: string, currentActive: boolean) => {
    try {
      await updateEcommerceProduct(productId, { active: !currentActive });
      await loadProducts();
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedImages: string[] = [...form.images];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `products/${user?.businessSlug || 'default'}/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, fileName);

        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedImages.push(url);

        if (i === 0) {
          setForm({ ...form, imageUrl: url });
        }
      }

      setForm({ ...form, images: uploadedImages });
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      price: '',
      originalPrice: '',
      currency: 'INR',
      category: '',
      brand: '',
      tags: '',
      inStock: true,
      stockCount: '',
      featured: false,
      sourceUrl: '',
      imageUrl: '',
      images: [],
    });
    setUrlValidation(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-off-white)' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user?.businessSlug) {
    return (
      <div className="section-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center', maxWidth: 400 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', fontWeight: 400, color: 'var(--color-deep-charcoal)', marginBottom: 12 }}>No Business Found</h2>
          <p style={{ color: 'var(--color-light-gray)', marginBottom: 24 }}>You need to register a business first to manage products.</p>
          <button onClick={() => router.push('/list-business')} className="btn btn-accent">
            Register Business
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 80, paddingBottom: 60 }}>
      <div className="container" style={{ maxWidth: 1400 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "'EB Garamond',serif", fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Product Management</h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Add and manage products from major ecommerce platforms</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '12px 24px',
              borderRadius: 'var(--r-md)',
              background: 'var(--amber)',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Icon d="M12 5v14M5 12h14" />
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 32, marginBottom: 32, boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>Add New Product</h2>

            <form onSubmit={handleSubmit}>
              {/* URL Fetch Section */}
              <div style={{ background: 'var(--amber-subtle)', border: '1px solid var(--amber-glow)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--amber)', marginBottom: 12 }}>🔗 Import from Ecommerce Platform</h3>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <input
                    type="url"
                    value={form.sourceUrl}
                    onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                    placeholder="Paste product URL from Amazon, Flipkart, Meesho, etc."
                    style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={handleUrlFetch}
                    disabled={fetching || !form.sourceUrl}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 8,
                      background: 'var(--amber)',
                      color: '#fff',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: fetching || !form.sourceUrl ? 'not-allowed' : 'pointer',
                      opacity: fetching || !form.sourceUrl ? 0.7 : 1,
                    }}
                  >
                    {fetching ? 'Fetching…' : 'Fetch Details'}
                  </button>
                </div>
                {urlValidation && !urlValidation.valid && (
                  <p style={{ fontSize: 12, color: 'var(--crimson)', marginTop: 8 }}>{urlValidation.error}</p>
                )}
                {urlValidation && urlValidation.valid && (
                  <p style={{ fontSize: 12, color: 'var(--success)', marginTop: 8 }}>✓ Valid {urlValidation.platform} URL</p>
                )}
                <p style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 8 }}>Supported: Amazon, Flipkart, Meesho, Myntra, Nykaa, AJIO, Snapdeal, JioMart</p>
              </div>

              {/* Basic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Product Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Wireless Bluetooth Headphones"
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="">Select category…</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the product features and benefits…"
                  required
                  rows={4}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              {/* Pricing */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Price (₹) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="999"
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Original Price (₹)</label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    placeholder="1499"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              {/* Brand & Tags */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Brand</label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="e.g. Sony, Samsung"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="e.g. wireless, bluetooth, headphones"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                </div>
              </div>

              {/* Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Stock Count</label>
                  <input
                    type="number"
                    value={form.stockCount}
                    onChange={(e) => setForm({ ...form, stockCount: e.target.value })}
                    placeholder="e.g. 50"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-hover)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 24 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.inStock}
                      onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                      style={{ width: 18, height: 18 }}
                    />
                    <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>In Stock</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      style={{ width: 18, height: 18 }}
                    />
                    <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>Featured Product</span>
                  </label>
                </div>
              </div>

              {/* Images */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Product Images</label>
                <div style={{ border: '2px dashed var(--border)', borderRadius: 12, padding: 32, textAlign: 'center', cursor: 'pointer', background: 'var(--surface-2)' }}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
                      {uploading ? 'Uploading…' : 'Click to upload images'}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-faint)' }}>JPG, PNG, WebP. Max 5MB per file.</p>
                  </label>
                </div>
                {form.images.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                    {form.images.map((img, i) => (
                      <div key={i} style={{ position: 'relative', width: 80, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <img src={img} alt={`Product ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {i === 0 && (
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 10, padding: '2px 4px', textAlign: 'center' }}>Main</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '12px 32px',
                  borderRadius: 8,
                  background: 'var(--amber)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? 'Adding…' : 'Add Product'}
              </button>
            </form>
          </div>
        )}

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', background: 'var(--surface)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🛍️</div>
            <h2 style={{ fontSize: 20, color: 'var(--text-primary)', marginBottom: 8 }}>No products yet</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Add your first product to start selling on BhartiyaBazar</p>
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: '12px 32px',
                borderRadius: 8,
                background: 'var(--amber)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Add First Product
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {products.map(product => (
              <div key={product.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ position: 'relative', marginBottom: 16 }}>
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }}
                  />
                  {product.featured && (
                    <div style={{ position: 'absolute', top: 8, right: 8, background: 'var(--amber)', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                      ⭐ Featured
                    </div>
                  )}
                  {!product.active && (
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                      Inactive
                    </div>
                  )}
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.title}
                </h3>

                <div style={{ display: 'flex', gap: 8, marginBottom: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                  <span>{product.category}</span>
                  {product.brand && <span>• {product.brand}</span>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
                      ₹{product.price.toLocaleString()}
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        ₹{product.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {product.views} views
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {product.tags?.slice(0, 3).map((tag: string, i: number) => (
                    <span key={i} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 'var(--r-full)', background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>{tag}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <button
                    onClick={() => handleToggleFeatured(product.id, product.featured)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 6,
                      background: product.featured ? 'var(--amber-subtle)' : 'var(--surface-2)',
                      color: product.featured ? 'var(--amber)' : 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {product.featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    onClick={() => handleToggleActive(product.id, product.active)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 6,
                      background: product.active ? 'var(--success-bg)' : 'var(--surface-2)',
                      color: product.active ? 'var(--success)' : 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {product.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 6,
                      background: 'rgba(239,68,68,0.1)',
                      color: '#ef4444',
                      border: '1px solid var(--border)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}