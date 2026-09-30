import api from './api'

function toFormData(payload) {
  const fd = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (key === 'images') {
      value.forEach((file) => fd.append('images[]', file))
    } else if (key === 'variants' || key === 'attributes') {
      value.forEach((item, i) => {
        Object.entries(item).forEach(([field, val]) => {
          if (field === 'attributes' && typeof val === 'object') {
            Object.entries(val).forEach(([attrKey, attrVal]) => {
              fd.append(`${key}[${i}][attributes][${attrKey}]`, attrVal)
            })
          } else if (val !== null && val !== undefined && val !== '') {
            fd.append(`${key}[${i}][${field}]`, val)
          }
        })
      })
    } else {
      fd.append(key, value)
    }
  })

  return fd
}

export async function fetchSellerProducts(params) {
  const { data } = await api.get('/api/v1/seller/products', { params })
  return data
}

export async function fetchSellerProduct(id) {
  const { data } = await api.get(`/api/v1/seller/products/${id}`)
  return data.data
}

export async function createSellerProduct(payload) {
  const { data } = await api.post('/api/v1/seller/products', toFormData(payload), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export async function updateSellerProduct(id, payload) {
  const fd = toFormData(payload)
  fd.append('_method', 'PUT') // Laravel method-spoofing for multipart PUT
  const { data } = await api.post(`/api/v1/seller/products/${id}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export async function deleteSellerProduct(id) {
  await api.delete(`/api/v1/seller/products/${id}`)
}

export async function deleteSellerProductImage(productId, imageId) {
  await api.delete(`/api/v1/seller/products/${productId}/images/${imageId}`)
}
