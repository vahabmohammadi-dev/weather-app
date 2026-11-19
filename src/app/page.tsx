import CitySearch from "@/components/CitySearch";
import WeatherCard from "@/components/WeatherCard";

const POPULAR = ["Tehran", "Isfahan", "Tabriz", "Berlin", "Istanbul", "Dubai"];

export default function HomePage() {
  return (
    <main className="container">
      <h1 className="title">آب‌وهوا</h1>
      <p className="subtitle">نام یک شهر را جستجو کنید.</p>
      <CitySearch />

      <h2 className="section-title">شهرهای پرطرفدار</h2>
      <div className="grid">
        {POPULAR.map((city) => (
          <WeatherCard key={city} name={city} />
        ))}
      </div>
    </main>
  );
}
