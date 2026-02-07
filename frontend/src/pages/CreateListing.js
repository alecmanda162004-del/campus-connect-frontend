import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'Used - Good',
    whatsapp_phone: '',
    stock_quantity: 1,
    category: 'Other',
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [variants, setVariants] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in to post a listing');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'stock_quantity' || name === 'price' ? Number(value) || '' : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { color: '', size: '', stock: 1 }]);
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    setVariants((prev) => {
      const newVariants = [...prev];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return newVariants;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!formData.title.trim()) {
      setMessage('Title is required');
      setLoading(false);
      return;
    }

    if (!formData.price || formData.price <= 0) {
      setMessage('Valid price is required');
      setLoading(false);
      return;
    }

    const validVariants = variants.filter(
      (v) => v.stock >= 0 && (v.color.trim() || v.size.trim())
    );

    if (variants.length > 0 && validVariants.length === 0) {
      setMessage('Please fill at least color or size for each variant, or remove empty ones');
      setLoading(false);
      return;
    }

    try {
      const imageUrls = [];

      for (const file of imageFiles) {
        const formDataImg = new FormData();
        formDataImg.append('image', file);

        const uploadRes = await api.post('/api/upload/image', formDataImg, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadStatus(`Uploading... ${percent}%`);
          },
        });

        imageUrls.push(uploadRes.data.url);
      }

      const listingData = {
        ...formData,
        image_urls: imageUrls,
        stock_quantity: Number(formData.stock_quantity) || 1,
        variants: validVariants,
      };

      await api.post('/api/listings', listingData);

      setMessage('Success! Your listing is pending approval.');
      setFormData({
        title: '',
        description: '',
        price: '',
        condition: 'Used - Good',
        whatsapp_phone: '',
        stock_quantity: 1,
        category: 'Other',
      });
      setImageFiles([]);
      setImagePreviews([]);
      setVariants([]);
      setUploadStatus('');
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || 'Something went wrong'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-dark text-white py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="card bg-dark border-secondary shadow-lg">
              <div className="card-body p-5">
                <h1 className="card-title text-center text-primary display-5 fw-bold mb-5">
                  Post a New Listing
                </h1>

                {message && (
                  <div
                    className={`alert ${
                      message.includes('Success') ? 'alert-success' : 'alert-danger'
                    } text-center mb-5`}
                  >
                    {message}
                  </div>
                )}

                {uploadStatus && (
                  <div className="alert alert-info text-center mb-4">{uploadStatus}</div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Title */}
                  <div className="mb-4">
                    <label className="form-label text-light fw-medium">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="form-control form-control-lg bg-secondary text-white border-secondary focus:border-primary"
                      placeholder="e.g. Littmann Classic III Stethoscope"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="form-label text-light fw-medium">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      className="form-control form-control-lg bg-secondary text-white border-secondary focus:border-primary"
                      placeholder="Describe the item, condition, features, etc..."
                    />
                  </div>

                  {/* Price + Stock */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label text-light fw-medium">Price (K) *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="form-control form-control-lg bg-secondary text-white border-secondary focus:border-primary"
                        placeholder="e.g. 2500"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-light fw-medium">Total Stock Quantity *</label>
                      <input
                        type="number"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={handleChange}
                        required
                        min="1"
                        className="form-control form-control-lg bg-secondary text-white border-secondary focus:border-primary"
                        placeholder="e.g. 10 (fallback if no variants)"
                      />
                      <small className="form-text text-muted">
                        This is fallback stock. Use variants below for different colors/sizes.
                      </small>
                    </div>
                  </div>

                  {/* Condition + Category */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label text-light fw-medium">Condition</label>
                      <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        className="form-select form-select-lg bg-secondary text-white border-secondary focus:border-primary"
                      >
                        <option>Used - Excellent</option>
                        <option>Used - Good</option>
                        <option>Used - Fair</option>
                        <option>New</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-light fw-medium">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="form-select form-select-lg bg-secondary text-white border-secondary focus:border-primary"
                      >
                        <option value="All">All Categories</option>
                        <option value="Accommodation">Accommodation</option>
                        <option value="Books">Books</option>
                        <option value="Clothes - Men">Clothes - Men</option>
                        <option value="Clothes - Women">Clothes - Women</option>
                        <option value="Crocs & Medical Footwear">Crocs & Medical Footwear</option>
                        <option value="Electronic Gadgets">Electronic Gadgets</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Jewellery">Jewellery</option>
                        <option value="Lab Coats & Scrubs">Lab Coats & Scrubs</option>
                        <option value="Medical Equipment & Tools">Medical Equipment & Tools</option>
                        <option value="Other">Other</option>
                        <option value="Shoes">Shoes</option>
                        <option value="Stationery & Study Aids">Stationery & Study Aids</option>
                        <option value="Stethoscopes & Diagnostic Tools">Stethoscopes & Diagnostic Tools</option>
                      </select>
                    </div>
                  </div>

                  {/* WhatsApp Phone */}
                  <div className="mb-4">
                    <label className="form-label text-light fw-medium">WhatsApp Phone (260...)</label>
                    <input
                      type="text"
                      name="whatsapp_phone"
                      value={formData.whatsapp_phone}
                      onChange={handleChange}
                      className="form-control form-control-lg bg-secondary text-white border-secondary focus:border-primary"
                      placeholder="e.g. 260977123456"
                    />
                  </div>

                  {/* Variants */}
                  <div className="mb-5">
                    <h3 className="text-light mb-3">Variants (Colors, Sizes, Stock per option)</h3>
                    <p className="text-muted mb-4">
                      Add different options if your item comes in multiple colors or sizes. Leave empty if not applicable.
                    </p>

                    {variants.map((variant, index) => (
                      <div key={index} className="row g-3 mb-3 align-items-end bg-secondary p-3 rounded">
                        <div className="col-md-4">
                          <input
                            type="text"
                            value={variant.color}
                            onChange={(e) => updateVariant(index, 'color', e.target.value)}
                            placeholder="Color (e.g. Red, Black)"
                            className="form-control bg-dark text-white border-secondary"
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            value={variant.size}
                            onChange={(e) => updateVariant(index, 'size', e.target.value)}
                            placeholder="Size (e.g. M, 42, One Size)"
                            className="form-control bg-dark text-white border-secondary"
                          />
                        </div>
                        <div className="col-md-2">
                          <input
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                            placeholder="Stock"
                            className="form-control bg-dark text-white border-secondary"
                          />
                        </div>
                        <div className="col-md-2">
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="btn btn-outline-danger w-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addVariant}
                      className="btn btn-outline-light w-100"
                    >
                      + Add Variant
                    </button>
                  </div>

                  {/* Images */}
                  <div className="mb-5">
                    <h3 className="text-light mb-3">Upload Images (multiple allowed)</h3>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="form-control form-control-lg bg-secondary text-white border-secondary"
                    />

                    {imagePreviews.length > 0 && (
                      <div className="row mt-4 g-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="col-6 col-md-4 col-lg-3">
                            <div className="position-relative">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="img-fluid rounded shadow"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn btn-primary btn-lg w-100 ${loading ? 'opacity-75' : ''}`}
                  >
                    {loading ? 'Posting...' : 'Post Listing'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;