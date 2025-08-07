import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-banner.jpg";

const promotionCards = [
  {
    title: "Siêu sale 8.8",
    subtitle: "Giảm đến 50%",
    badge: "HOT",
    color: "bg-gradient-to-r from-orange-400 to-pink-500"
  },
  {
    title: "Deal riêng 50% YapeeVIP",
    subtitle: "Chỉ hôm nay",
    badge: "VIP",
    color: "bg-gradient-to-r from-purple-500 to-blue-500"
  },
  {
    title: "Yapee Trading",
    subtitle: "Đầu tư thông minh",
    badge: "NEW",
    color: "bg-gradient-to-r from-green-400 to-blue-500"
  },
  {
    title: "Coupon siêu hot",
    subtitle: "Giảm ngay",
    badge: "SALE",
    color: "bg-gradient-to-r from-red-500 to-orange-500"
  },
  {
    title: "Back to School",
    subtitle: "Văn phòng phẩm",
    badge: "TREND",
    color: "bg-gradient-to-r from-blue-500 to-cyan-500"
  },
  {
    title: "Xả kho giấm mũi giá",
    subtitle: "Sale 50%",
    badge: "HOT",
    color: "bg-gradient-to-r from-yellow-400 to-orange-500"
  }
];

const HeroSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main hero banner */}
        <div className="lg:col-span-3">
          <Card className="relative overflow-hidden h-80 bg-gradient-hero shadow-card">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
            <div className="relative h-full flex items-center p-8">
              <div className="text-primary-foreground">
                <h1 className="text-4xl font-bold mb-4 animate-fade-in">
                  Deal siêu hot
                  <br />
                  <span className="text-accent">Giảm đến 50%</span>
                </h1>
                <p className="text-xl mb-6 text-primary-foreground/90">
                  Hàng ngàn sản phẩm chất lượng với giá ưu đãi
                </p>
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent-hover text-accent-foreground shadow-button animate-bounce-gentle"
                >
                  Mua ngay
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Promotion cards */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          {promotionCards.slice(0, 6).map((promo, index) => (
            <Card 
              key={index}
              className={`relative overflow-hidden cursor-pointer group h-28 lg:h-16 ${promo.color} hover:scale-105 transition-all duration-200 shadow-card`}
            >
              <div className="absolute top-2 right-2">
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  {promo.badge}
                </span>
              </div>
              <div className="h-full flex items-center p-4">
                <div className="text-white">
                  <h3 className="font-semibold text-sm lg:text-xs leading-tight">
                    {promo.title}
                  </h3>
                  <p className="text-white/90 text-xs lg:text-xs">
                    {promo.subtitle}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;