import { 
  Smartphone, 
  Laptop, 
  Shirt, 
  Home, 
  Baby, 
  Gamepad2, 
  BookOpen, 
  Flower,
  Car,
  Dumbbell,
  ChefHat,
  Gem
} from "lucide-react";
import { Card } from "@/components/ui/card";

const categories = [
  { name: "Điện Thoại - Máy Tính Bảng", icon: Smartphone, color: "text-blue-500" },
  { name: "Laptop - Máy Vi Tính - Linh kiện", icon: Laptop, color: "text-purple-500" },
  { name: "Thời trang nam", icon: Shirt, color: "text-green-500" },
  { name: "Nhà Cửa - Đời Sống", icon: Home, color: "text-orange-500" },
  { name: "Đồ Chơi - Mẹ & Bé", icon: Baby, color: "text-pink-500" },
  { name: "Thiết Bị Số - Phụ Kiện Số", icon: Gamepad2, color: "text-indigo-500" },
  { name: "Làm Đẹp - Sức Khỏe", icon: Flower, color: "text-red-500" },
  { name: "Ô Tô - Xe Máy - Xe Đạp", icon: Car, color: "text-gray-600" },
  { name: "Thể Thao - Dã Ngoại", icon: Dumbbell, color: "text-yellow-600" },
  { name: "Bách Hóa Online", icon: ChefHat, color: "text-teal-500" },
  { name: "Nhà Sách Yapee", icon: BookOpen, color: "text-amber-600" },
  { name: "Vouchers - Dịch vụ", icon: Gem, color: "text-violet-500" }
];

const CategoryGrid = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-6 text-foreground">Danh mục</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <Card 
              key={index}
              className="p-4 hover:shadow-card transition-all duration-200 cursor-pointer group border border-border/50 hover:border-primary/30 bg-gradient-card"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-full bg-primary-light group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 ${category.color} group-hover:text-primary-foreground`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">
                  {category.name}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;