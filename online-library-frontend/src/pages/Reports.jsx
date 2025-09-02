import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

const Reports = () => {
  const [topCategories, setTopCategories] = useState({});
  const [dailyBorrows, setDailyBorrows] = useState([]);
  const [monthlyBorrows, setMonthlyBorrows] = useState([]);
  const [yearlyBorrows, setYearlyBorrows] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [currentlyBorrowed, setCurrentlyBorrowed] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setTopCategories((await api.get("/reports/top-category")).data.data || {});
      setDailyBorrows((await api.get("/reports/daily")).data.data || []);
      setMonthlyBorrows((await api.get("/reports/monthly")).data.data || []);
      setYearlyBorrows((await api.get("/reports/yearly")).data.data || []);
      setTopBooks((await api.get("/reports/top-books")).data.data || []);
      setTopUsers((await api.get("/reports/top-users")).data.data || []);
      setCurrentlyBorrowed((await api.get("/reports/currently-borrowed")).data.data || []);
      setOverdueBooks((await api.get("/reports/overdue")).data.data || []);
    } catch (err) {
      toast.error("Failed to fetch reports");
    }
  };

  const onRangeSubmit = (data) => {
    api.get("/reports/category-range", { params: data })
      .then((res) => {
        toast.success("Range Data Fetched!");
        console.log(res.data.data);
      })
      .catch(() => toast.error("Failed"));
  };

  const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ef4444", "#06b6d4"];

  const NoData = () => (
    <div className="flex justify-center items-center h-64 text-gray-300 italic">
      No data available
    </div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=80')",
        }}
      ></div>

      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 py-10 px-6 space-y-10 w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3">
        <h1 className="text-3xl font-bold mb-4 text-center text-white drop-shadow-lg">
          📊 Reports Dashboard
        </h1>

<div className="bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/30">
  <h2 className="text-xl font-semibold mb-4 text-white">🏆 Top Categories</h2>
  {Object.keys(topCategories).length > 0 ? (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={Object.entries(topCategories).map(([k, v]) => ({ name: k, value: v }))}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
          labelLine={false}
        >
          {Object.keys(topCategories).map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(199, 204, 197, 0.8)",
            color: "white",
            borderRadius: "8px",
            border: "none",
          }}
        />
        <Legend
          verticalAlign="bottom"
          wrapperStyle={{
            backgroundColor: "rgba(0,0,0,0.4)",
            borderRadius: "8px",
            padding: "6px 12px",
            color: "white",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  ) : <NoData />}
</div>


        {/* Daily Borrows */}
        <div className="bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/30">
          <h2 className="text-xl font-semibold mb-4 text-white">📅 Daily Borrows</h2>
          {dailyBorrows.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyBorrows}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.7)", color: "white" }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : <NoData />}
        </div>

        {/* Monthly Borrows */}
        <div className="bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/30">
          <h2 className="text-xl font-semibold mb-4 text-white">📆 Monthly Borrows</h2>
          {monthlyBorrows.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyBorrows}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                <XAxis dataKey="month" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.7)", color: "white" }} />
                <Bar dataKey="count" fill="url(#colorGradient)" radius={[10, 10, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : <NoData />}
        </div>

        
        <form
          onSubmit={handleSubmit(onRangeSubmit)}
          className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg p-6 mt-6 flex gap-3 items-center border border-white/30"
        >
          <input type="date" {...register("start")} className="p-2 rounded bg-white/30 text-white placeholder-white/70" />
          <input type="date" {...register("end")} className="p-2 rounded bg-white/30 text-white placeholder-white/70" />
          <button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded shadow">
            Get Category Range
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reports;
