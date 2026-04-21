import { BookOpen } from "lucide-react";

function Logo({
  size = 28,
  textSize = "text-xl",
  center = false,
  showText = true,
}) {
  return (
    <div
      className={`flex items-center ${
        center ? "justify-center" : ""
      } gap-2 text-blue-600 font-bold ${textSize}`}
    >
      <BookOpen size={size} />
      {showText && <span>SmartLib</span>}
    </div>
  );
}

export default Logo;