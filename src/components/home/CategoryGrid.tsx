import { Link } from 'react-router-dom'

interface Category {
  id: string
  name: string
  imageUrl: string
  slug: string
}

const CategoryGrid = () => {
  // Mock category data - in real app, this would come from API
  const categories: Category[] = [
    {
      id: '1',
      name: 'Thời Trang Nam',
      imageUrl: 'https://picsum.photos/200/200?random=8',
      slug: 'thoi-trang-nam'
    },
    {
      id: '2',
      name: 'Thời Trang Nữ',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      slug: 'thoi-trang-nu'
    },
    {
      id: '3',
      name: 'Điện Thoại & Phụ Kiện',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      slug: 'dien-thoai-phu-kien'
    },
    {
      id: '4',
      name: 'Máy Tính & Laptop',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      slug: 'may-tinh-laptop'
    },
    {
      id: '5',
      name: 'Máy Ảnh & Máy Quay Phim',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      slug: 'may-anh-may-quay-phim'
    },
    {
      id: '6',
      name: 'Đồng Hồ',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      slug: 'dong-ho'
    },
    {
      id: '7',
      name: 'Giày Dép Nam',
      imageUrl: 'https://picsum.photos/200/200?random=9',
      slug: 'giay-dep-nam'
    },
    {
      id: '8',
      name: 'Giày Dép Nữ',
      imageUrl: 'https://picsum.photos/200/200?random=10',
      slug: 'giay-dep-nu'
    },
    {
      id: '9',
      name: 'Túi Ví Nữ',
      imageUrl: 'https://picsum.photos/200/200?random=11',
      slug: 'tui-vi-nu'
    },
    {
      id: '10',
      name: 'Thiết Bị Điện Tử',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      slug: 'thiet-bi-dien-tu'
    },
    {
      id: '11',
      name: 'Ô Tô & Xe Máy & Xe Đạp',
      imageUrl: 'https://picsum.photos/200/200?random=12',
      slug: 'o-to-xe-may-xe-dap'
    },
    {
      id: '12',
      name: 'Nhà Cửa & Đời Sống',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      slug: 'nha-cua-doi-song'
    },
    {
      id: '13',
      name: 'Sắc Đẹp',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      slug: 'sac-dep'
    },
    {
      id: '14',
      name: 'Sức Khỏe',
      imageUrl: 'https://picsum.photos/200/200?random=13',
      slug: 'suc-khoe'
    },
    {
      id: '15',
      name: 'Thể Thao & Du Lịch',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      slug: 'the-thao-du-lich'
    },
    {
      id: '16',
      name: 'Bách Hóa Online',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      slug: 'bach-hoa-online'
    },
    {
      id: '17',
      name: 'Thời Trang Trẻ Em',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      slug: 'thoi-trang-tre-em'
    },
    {
      id: '18',
      name: 'Giặt Giũ & Chăm Sóc Nhà Cửa',
      imageUrl: 'https://picsum.photos/200/200?random=12',
      slug: 'giat-giu-cham-soc-nha-cua'
    },
    {
      id: '19',
      name: 'Thời Trang Nữ',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      slug: 'thoi-trang-nu-2'
    },
    {
      id: '20',
      name: 'Voucher & Dịch Vụ',
      imageUrl: 'https://picsum.photos/300/300?random=1',
      slug: 'voucher-dich-vu'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        DANH MỤC
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className="flex flex-col items-center group hover:bg-gray-50 p-3 rounded-lg transition-colors"
          >
            <div className="w-16 h-16 mb-2 overflow-hidden rounded-lg border border-gray-200 group-hover:border-orange-300 transition-colors">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
              />
            </div>
            <span className="text-xs text-center text-gray-700 group-hover:text-orange-500 transition-colors leading-tight">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CategoryGrid