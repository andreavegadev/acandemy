import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const BestSellersPage = ({ type }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      let query = supabase
        .from("products")
        .select("*")
        .order("sold", { ascending: type === "worst" });
      const { data } = await query.limit(10);
      setProducts(data || []);
    };
    fetch();
  }, [type]);

  return (
    <div>
      <h2>
        {type === "best"
          ? "Productos más vendidos"
          : "Productos menos vendidos"}
      </h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - Vendidos: {p.sold ?? 0}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BestSellersPage;
