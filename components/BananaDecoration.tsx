/**
 * BananaDecoration - 香蕉元素装饰组件
 * 为页面添加香蕉主题的视觉装饰
 */

export default function BananaDecoration() {
  return (
    <>
      {/* 左上角大香蕉 - 更真实的形状 */}
      <svg
        className="absolute top-10 -left-10 w-48 h-48 opacity-20 rotate-[-30deg] pointer-events-none"
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bananaGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#FFE135',stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#F4D03F',stopOpacity:1}} />
          </linearGradient>
        </defs>
        {/* 香蕉主体 - 使用贝塞尔曲线创建真实的弯曲形状 */}
        <path
          d="M 15 65
             Q 25 55, 35 50
             Q 50 42, 65 38
             Q 80 34, 95 28
             Q 105 24, 115 20
             L 112 16
             Q 100 20, 85 26
             Q 70 32, 55 38
             Q 40 44, 30 52
             Q 20 60, 12 68
             Z"
          fill="url(#bananaGrad1)"
        />
        {/* 香蕉梗端 */}
        <ellipse cx="14" cy="66" rx="6" ry="4" fill="#E8C932" />
        {/* 香蕉尖端 */}
        <path d="M 112 16 L 115 20 L 110 19 Z" fill="#E8C932" />
      </svg>

      {/* 右上角漂浮香蕉 */}
      <svg
        className="absolute top-40 right-20 w-32 h-32 opacity-15 rotate-12 pointer-events-none"
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 20 60
             Q 30 50, 40 45
             Q 55 38, 70 34
             Q 85 30, 100 24
             Q 110 20, 118 16
             L 115 12
             Q 105 16, 90 22
             Q 75 28, 60 34
             Q 45 40, 35 48
             Q 25 56, 18 64
             Z"
          fill="#FFE135"
        />
        <ellipse cx="19" cy="61" rx="5" ry="3" fill="#E8C932" />
      </svg>

      {/* 中间左侧小香蕉 */}
      <svg
        className="absolute top-[30%] left-10 w-24 h-24 opacity-12 -rotate-45 pointer-events-none"
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 25 55
             Q 35 45, 45 40
             Q 60 33, 75 29
             Q 90 25, 105 19
             Q 115 15, 118 11
             L 115 7
             Q 100 13, 85 19
             Q 70 25, 55 31
             Q 40 37, 30 45
             Q 20 53, 18 58
             Z"
          fill="#FFE135"
        />
      </svg>

      {/* 右下角大香蕉串 - 三根香蕉 */}
      <svg
        className="absolute bottom-20 -right-10 w-64 h-64 opacity-18 rotate-[20deg] pointer-events-none"
        viewBox="0 0 140 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 香蕉1 - 最上面 */}
        <path
          d="M 10 100
             Q 20 88, 30 82
             Q 45 73, 60 68
             Q 75 63, 90 56
             Q 105 49, 120 42
             Q 130 37, 138 32
             L 135 28
             Q 125 33, 110 40
             Q 95 47, 80 54
             Q 65 61, 50 70
             Q 35 79, 25 90
             Q 15 100, 8 105
             Z"
          fill="#FFE135"
        />
        <ellipse cx="9" cy="101" rx="6" ry="4" fill="#E8C932" />

        {/* 香蕉2 - 中间 */}
        <path
          d="M 15 95
             Q 25 83, 35 77
             Q 50 68, 65 63
             Q 80 58, 95 51
             Q 110 44, 125 37
             Q 135 32, 138 27
             L 135 23
             Q 120 30, 105 37
             Q 90 44, 75 51
             Q 60 58, 45 67
             Q 30 76, 20 87
             Q 10 97, 8 102
             Z"
          fill="#F4D03F"
        />
        <ellipse cx="14" cy="96" rx="6" ry="4" fill="#E8C932" />

        {/* 香蕉3 - 最下面 */}
        <path
          d="M 20 90
             Q 30 78, 40 72
             Q 55 63, 70 58
             Q 85 53, 100 46
             Q 115 39, 130 32
             Q 135 29, 138 22
             L 135 18
             Q 120 25, 105 32
             Q 90 39, 75 46
             Q 60 53, 45 62
             Q 30 71, 20 82
             Q 10 92, 8 97
             Z"
          fill="#FFE866"
        />
        <ellipse cx="19" cy="91" rx="6" ry="4" fill="#E8C932" />
      </svg>

      {/* 左下角装饰 */}
      <svg
        className="absolute bottom-40 left-0 w-24 h-24 opacity-12 rotate-[-15deg] pointer-events-none"
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 30 55
             Q 40 43, 50 37
             Q 65 28, 80 24
             Q 95 20, 110 14
             Q 118 10, 118 6
             L 115 2
             Q 100 8, 85 14
             Q 70 20, 55 29
             Q 40 38, 30 50
             Q 20 60, 18 65
             Z"
          fill="#FFE135"
        />
      </svg>

      {/* 浮动圆形装饰 */}
      <div className="absolute top-[15%] right-[10%] w-4 h-4 rounded-full bg-yellow-400 opacity-20 blur-sm animate-pulse" />
      <div className="absolute top-[25%] left-[15%] w-3 h-3 rounded-full bg-orange-400 opacity-15 blur-sm animate-pulse" style={{animationDelay: '0.5s'}} />
      <div className="absolute top-[45%] right-[20%] w-5 h-5 rounded-full bg-pink-400 opacity-10 blur-sm animate-pulse" style={{animationDelay: '1s'}} />
      <div className="absolute bottom-[30%] left-[8%] w-4 h-4 rounded-full bg-yellow-300 opacity-15 blur-sm animate-pulse" style={{animationDelay: '1.5s'}} />
      <div className="absolute bottom-[15%] right-[15%] w-3 h-3 rounded-full bg-amber-400 opacity-20 blur-sm animate-pulse" style={{animationDelay: '2s'}} />

      {/* 星星装饰 */}
      <div className="absolute top-[20%] left-[25%] text-yellow-400 opacity-15 text-xs">✦</div>
      <div className="absolute top-[35%] right-[12%] text-yellow-300 opacity-12 text-sm">✦</div>
      <div className="absolute bottom-[25%] left-[18%] text-yellow-400 opacity-10 text-xs">✦</div>
      <div className="absolute bottom-[40%] right-[25%] text-yellow-300 opacity-15 text-sm">✦</div>

      {/* 顶部渐变条 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 opacity-40" />

      {/* 波浪装饰 */}
      <svg
        className="absolute top-0 left-0 right-0 h-12 opacity-10 pointer-events-none"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,64 C480,150 960,0 1440,64 L1440,0 L0,0 Z"
          fill="url(#waveGradient)"
        />
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:'#FDE68A',stopOpacity:1}} />
            <stop offset="50%" style={{stopColor:'#FBBF24',stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#FDE68A',stopOpacity:1}} />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}
