// hooks/usePropertyList.ts
import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast"; // For user feedback
import { parseAxiosError } from "@/lib/parseAxiosError"; // Your error parsing utility
import { useAuth } from "@/contexts/AuthContext"; // Import your AuthContext hook

// Define the Location interface as per our previous discussion
interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
}

// Update Property interface to include location and remove generic index signature
export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrls: string[];
  location: Location; // Added location object
  ownerContact: {
    email: string;
    phone?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  // Removed [key: string]: any; to enforce stricter typing
}

export function usePropertyList() {
  const { isAuthenticated, user, loading: authLoading } = useAuth(); // Get auth state and user from context

  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true); // Specific loading for properties fetch
  const [propertiesError, setPropertiesError] = useState<string | null>(null);

  const [favoritePropertyIds, setFavoritePropertyIds] = useState<string[]>([]); // Renamed for clarity
  const [loadingFavorites, setLoadingFavorites] = useState(false); // Specific loading for favorites fetch
  const [favoritingAction, setFavoritingAction] = useState(false); // For add/remove action
  const [favoritesError, setFavoritesError] = useState<string | null>(null);

  // --- 1. Fetch All Properties (Runs once on mount) ---
  useEffect(() => {
    setLoadingProperties(true);
    setPropertiesError(null);
    axios
      .get("/api/properties")
      .then((res) => {
        if (res.data.success) {
          setProperties(res.data.data);
        } else {
          setPropertiesError(res.data.message || "Failed to fetch properties");
          toast.error(res.data.message || "Failed to fetch properties");
        }
      })
      .catch((err) => {
        const errorMessage = parseAxiosError(err);
        setPropertiesError(errorMessage);
        toast.error(errorMessage);
      })
      .finally(() => setLoadingProperties(false));
  }, []); // Empty dependency array: runs only once on component mount

  // --- 2. Fetch Favorite Properties for the Authenticated User ---
  // This effect runs when isAuthenticated status or user.id changes.
  useEffect(() => {
    // Only fetch favorites if user is authenticated and authLoading is false
    if (isAuthenticated && user && !authLoading) {
      setLoadingFavorites(true);
      setFavoritesError(null);
      axios
        .get("/api/saved-listings") // Corrected endpoint name to /api/saved-listings
        .then((res) => {
          if (res.data.success) {
            // Assuming backend returns an array of populated Property objects or objects with propertyId
            // If it returns Property objects, you'd map to their _id:
            const savedIds = res.data.data.map((favItem: Property) => favItem._id); // Assuming favItem is a Property object
            setFavoritePropertyIds(savedIds);
          } else {
            setFavoritesError(
              res.data.message || "Failed to fetch favorite properties"
            );
            toast.error(
              res.data.message || "Failed to fetch favorite properties"
            );
          }
        })
        .catch((err) => {
          const errorMessage = parseAxiosError(err);
          setFavoritesError(errorMessage);
          // Don't show toast for 401/403 errors here, as the user might just not be logged in.
          // The UI should handle showing "Sign in to save properties" instead.
          if (err.response?.status !== 401 && err.response?.status !== 403) {
            toast.error(`Error fetching favorites: ${errorMessage}`);
          }
        })
        .finally(() => setLoadingFavorites(false));
    } else if (!isAuthenticated && !authLoading) {
      // If user logs out or is not authenticated, clear favorites
      setFavoritePropertyIds([]);
      setFavoritesError(null);
    }
  }, [isAuthenticated, user, authLoading]); // Re-run when auth status changes

  // --- 3. Add a Property to Favorites ---
  const addFavorite = useCallback(
    async (propertyId: string) => {
      if (!isAuthenticated) {
        toast.error("Please sign in to save properties.");
        return;
      }
      setFavoritingAction(true);
      setFavoritesError(null);
      try {
        // POST to /api/saved-listings
        const res = await axios.post("/api/saved-listings", { propertyId }); // Corrected endpoint name
        if (res.data.success) {
          setFavoritePropertyIds((prev) => [...prev, propertyId]);
          toast.success("Property saved!");
        } else {
          setFavoritesError(res.data.message || "Failed to save property.");
          toast.error(res.data.message || "Failed to save property.");
        }
      } catch (err: any) {
        const errorMessage = parseAxiosError(err);
        setFavoritesError(errorMessage);
        toast.error(`Failed to save property: ${errorMessage}`);
      } finally {
        setFavoritingAction(false);
      }
    },
    [isAuthenticated]
  ); // Dependency on isAuthenticated

  // --- 4. Remove a Property from Favorites ---
  const removeFavorite = useCallback(
    async (propertyId: string) => {
      if (!isAuthenticated) {
        toast.error("You must be signed in to unsave properties.");
        return;
      }
      setFavoritingAction(true);
      setFavoritesError(null);
      try {
        // DELETE to /api/saved-listings/:propertyId
        const res = await axios.delete(`/api/saved-listings/${propertyId}`); // Corrected endpoint name
        if (res.data.success) {
          // Assuming your DELETE API returns { success: true } or 204 No Content
          setFavoritePropertyIds((prev) =>
            prev.filter((id) => id !== propertyId)
          );
          toast.success("Property unsaved!");
        } else {
          setFavoritesError(res.data.message || "Failed to unsave property.");
          toast.error(res.data.message || "Failed to unsave property.");
        }
      } catch (err: any) {
        const errorMessage = parseAxiosError(err);
        setFavoritesError(errorMessage);
        toast.error(`Failed to unsave property: ${errorMessage}`);
      } finally {
        setFavoritingAction(false);
      }
    },
    [isAuthenticated]
  ); // Dependency on isAuthenticated

  // --- 5. Check if a property is a favorite ---
  const isFavorite = useCallback(
    (propertyId: string) => {
      return favoritePropertyIds.includes(propertyId);
    },
    [favoritePropertyIds]
  );

  return {
    properties,
    loadingProperties,
    propertiesError,
    favoritePropertyIds,
    loadingFavorites,
    favoritingAction,
    favoritesError,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
