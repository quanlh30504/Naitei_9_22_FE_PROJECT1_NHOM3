"use client";
import Breadcrumb from "@/Components/Breadcrumb";
import GoogleMap from "@/app/map/components/GoogleMap";

export default function MapPage() {
    // URL Google Maps từ biến môi trường
    const mapSrc = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL || "";

    return (
        <main>
            <div className="px-4 md:px-8 lg:px-12 py-6 bg-white min-h-screen">
                <Breadcrumb current="Bản đồ" />

                <h1 className="text-3xl font-bold text-gray-800 mb-8">VỊ TRÍ CỬA HÀNG</h1>

                {/* Main */}
                <div className="flex flex-col lg:flex-row gap-8 h-full">

                    {/* Left stuff */}
                    <div className="w-full lg:w-1/4 space-y-6">

                        {/* Contact Information */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Thông tin liên hệ
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Địa chỉ:</h3>
                                    <p className="text-gray-700">
                                        Tòa nhà Landmark 72<br />
                                        Phạm Hùng, Nam Từ Liêm, Hà Nội
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Điện thoại:</h3>
                                    <p className="text-gray-700">(024) 1234 5678</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Email:</h3>
                                    <p className="text-gray-700">info@mandalastore.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Opening Hours */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Giờ mở cửa
                            </h3>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span className="font-medium">Thứ 2 - Thứ 6:</span>
                                    <span>08:00 - 20:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Thứ 7:</span>
                                    <span>08:00 - 22:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Chủ nhật:</span>
                                    <span>09:00 - 21:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Ngày lễ:</span>
                                    <span>09:00 - 18:00</span>
                                </div>
                            </div>
                        </div>

                        {/* Transportation Info */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold text-purple-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Hướng dẫn
                            </h3>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div>
                                    <span className="font-medium">🚗 Xe ô tô:</span><br />
                                    <span>Bãi đỗ xe tại tầng hầm</span>
                                </div>
                                <div>
                                    <span className="font-medium">🚌 Xe buýt:</span><br />
                                    <span>Tuyến 14, 18, 41</span>
                                </div>
                                <div>
                                    <span className="font-medium">🚇 Metro:</span><br />
                                    <span>Ga Phạm Hùng (tuyến 3)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Google Map */}
                    <div className="w-full lg:w-3/4">
                        <div className="h-full">
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2 lg:mb-0">
                                    Bản đồ vị trí cửa hàng
                                </h2>
                                <div className="relative">
                                    {/* Patriotic Message with Animation */}
                                    <div className="bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 text-white px-4 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 animate-pulse">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center animate-bounce">
                                                <span className="text-xl">🇻🇳</span>
                                                <span className="text-lg ml-1">⭐</span>
                                            </div>
                                            <div className="font-bold text-sm lg:text-base tracking-wide">
                                                <span className="drop-shadow-lg">HOÀNG SA, TRƯỜNG SA</span>
                                                <br />
                                                <span className="text-yellow-200 drop-shadow-lg">LÀ CỦA VIỆT NAM!</span>
                                            </div>
                                            <div className="flex items-center animate-bounce">
                                                <span className="text-lg mr-1">⭐</span>
                                                <span className="text-xl">🇻🇳</span>
                                            </div>
                                        </div>
                                        {/* Decorative Border */}
                                        <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg animate-ping opacity-20"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[70vh] lg:h-[80vh]">
                                <GoogleMap
                                    src={mapSrc}
                                    height="100%"
                                    title="Vị trí cửa hàng Mandala Store"
                                    className="w-full h-full"
                                    enableZoomControls={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
