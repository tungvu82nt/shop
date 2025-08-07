import { Star, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { useMediaService } from "@/services/mediaService";

const products = [
  {
    id: 1,
    name: "Điện thoại POCO C75 (8GB/256GB) - Hàng Chính Hãng",
    price: 2790000,
    originalPrice: 3290000,
    discount: 18,
    rating: 4.5,
    sold: 1200,
    category: "smartphone",
    isFreeship: true,
    isYapeeNow: true
  },
  {
    id: 2,
    name: "Bến Thúa Ước",
    price: 89000,
    originalPrice: 120000,
    discount: 32,
    rating: 5.0,
    sold: 850,
    category: "book",
    isFreeship: true,
    isAuthenticStamp: true
  },
  {
    id: 3,
    name: "Chuột không dây LOGITECH M331 Công USB",
    price: 293280,
    originalPrice: 312000,
    discount: 6,
    rating: 4.7,
    sold: 2100,
    category: "computer-accessories",
    isFreeship: true,
    isYapeeNow: true
  },
  {
    id: 4,
    name: "Sách tiếng Anh - 1000 Animals - 1000 Pictures",
    price: 331614,
    originalPrice: 405000,
    discount: 18,
    rating: 4.8,
    sold: 450,
    category: "book",
    isFreeship: true,
    isAuthenticStamp: true
  },
  {
    id: 5,
    name: "Smart Tivi Samsung 4K 65 inch UA65DU7000KXXV",
    price: 10350000,
    originalPrice: 15900000,
    discount: 35,
    rating: 4.6,
    sold: 89,
    category: "tv",
    isFreeship: true,
    isYapeeNow: true,
    isFlashSale: true
  },
  {
    id: 6,
    name: "Collins - Get Ready For IELTS - Reading",
    price: 105000,
    originalPrice: 135000,
    discount: 23,
    rating: 4.9,
    sold: 678,
    category: "book",
    isFreeship: true,
    isAuthenticStamp: true
  }
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const ProductGrid = () => {
  const { getProductImage } = useMediaService();
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Gợi ý hôm nay</h2>
        <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
          Xem tất cả
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => {
          const productImage = getProductImage(product.name, 'SMALL');
          
          return (
            <Card 
              key={product.id}
              className="group hover:shadow-card transition-all duration-200 cursor-pointer border border-border/50 hover:border-primary/30 bg-gradient-card"
            >
              <div className="relative">
                {/* Product image with optimization */}
                <div className="aspect-square rounded-t-lg overflow-hidden">
                  <OptimizedImage
                    src={productImage.url}
                    alt={productImage.alt}
                    fallbackSrc={productImage.fallbackUrl}
                    width={280}
                    height={280}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    lazy={true}
                    responsive={true}
                    placeholder="skeleton"
                  />
                </div>
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isFlashSale && (
                    <Badge className="bg-sale text-sale-foreground text-xs">
                      FLASH SALE
                    </Badge>
                  )}
                  {product.discount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      -{product.discount}%
                    </Badge>
                  )}
                </div>
                
                {/* Favorite button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            
            <div className="p-3 space-y-2">
              {/* Service badges */}
              <div className="flex gap-1 flex-wrap">
                {product.isFreeship && (
                  <Badge variant="outline" className="text-xs bg-primary-light text-primary border-primary/30">
                    Freeship
                  </Badge>
                )}
                {product.isYapeeNow && (
                  <Badge variant="outline" className="text-xs bg-accent-light text-accent border-accent/30">
                    2H
                  </Badge>
                )}
                {product.isAuthenticStamp && (
                  <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                    Chính hãng
                  </Badge>
                )}
              </div>
              
              {/* Product name */}
              <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              
              {/* Rating and sold */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating}</span>
                </div>
                <span>|</span>
                <span>Đã bán {product.sold}</span>
              </div>
              
              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-sale">
                    {formatPrice(product.price)}
                  </span>
                </div>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </Card>
          )
        })}
      </div>
    </div>
  );
};

export default ProductGrid;