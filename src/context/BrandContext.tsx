import { createContext, useState, useEffect, useContext} from 'react';
import type { ReactNode } from 'react';
import { getBrands } from '../api/brandsService';

// Define interfaces para los datos que manejas
interface Supplier {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
  description: string;
  suppliers: Supplier[];
}

interface BrandContextType {
  brands: Brand[];
  loading: boolean;
}

// Contexto con tipos
const BrandContext = createContext<BrandContextType>({
  brands: [],
  loading: false,
});

interface BrandProviderProps {
  children: ReactNode;  // Para que children tenga el tipo correcto
}

export const BrandProvider = ({ children }: BrandProviderProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const res = await getBrands();
        const records = res.data.records;

        const uniqueBrandsMap = new Map<string, Brand>();

        records.forEach((brand: any) => {
          if (!uniqueBrandsMap.has(brand.brand_id)) {
            uniqueBrandsMap.set(brand.brand_id, {
              id: brand.brand_id,
              name: brand.brand_name,
              description: brand.description,
              suppliers: [{ id: brand.supplier_id, name: brand.supplier_name }],
            });
          } else {
            const existing = uniqueBrandsMap.get(brand.brand_id)!;
            if (!existing.suppliers.some((s: Supplier) => s.id === brand.supplier_id)) {
              existing.suppliers.push({ id: brand.supplier_id, name: brand.supplier_name });
            }
          }
        });

        setBrands(Array.from(uniqueBrandsMap.values()));
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <BrandContext.Provider value={{ brands, loading }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrands = () => useContext(BrandContext);
