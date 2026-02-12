import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import { type HomeSection } from "../../types/homeSectionType";

const API_URL = "/api/admin/home-sections";

// ---------- State Type ----------
interface HomeSectionState {
  sections: HomeSection[];
  loading: boolean;
  error: string | null;
  sectionCreated: boolean;
  sectionUpdated: boolean;
}

// ---------- Initial State ----------
const initialState: HomeSectionState = {
  sections: [],
  loading: false,
  error: null,
  sectionCreated: false,
  sectionUpdated: false,
};

// ---------- Async Thunks ----------

// CREATE
export const createHomeSection = createAsyncThunk<
  HomeSection,
  { section: Partial<HomeSection>; jwt: string },
  { rejectValue: string }
>("homeSection/create", async ({ section, jwt }, { rejectWithValue }) => {
  try {
    const payload = {
      title: section.title,
      category: section.category,
      tag: section.tag,
      layout: section.layout,
      limit: section.limit,
      order: section.order,
      isActive: section.isActive,
    };

    const res = await api.post(`${API_URL}/`, payload, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create home section"
    );
  }
});

// FETCH ALL
export const fetchHomeSections = createAsyncThunk<
  HomeSection[],
  string,
  { rejectValue: string }
>("homeSection/fetchAll", async (jwt, { rejectWithValue }) => {
  try {
    const res = await api.get(`${API_URL}/`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "Failed to fetch home sections"
    );
  }
});

// UPDATE
export const updateHomeSection = createAsyncThunk<
  HomeSection,
  { sectionId: string; data: Partial<HomeSection>; jwt: string },
  { rejectValue: string }
>(
  "homeSection/update",
  async ({ sectionId, data, jwt }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${API_URL}/${sectionId}`, data, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to update home section"
      );
    }
  }
);

// DELETE
export const deleteHomeSection = createAsyncThunk<
  string,
  { id: string; jwt: string },
  { rejectValue: string }
>("homeSection/delete", async ({ id, jwt }, { rejectWithValue }) => {
  try {
    await api.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "Failed to delete home section"
    );
  }
});

// ---------- Slice ----------
const homeSectionSlice = createSlice({
  name: "homeSection",
  initialState,
  reducers: {
    resetHomeSectionState: (state) => {
      state.sectionCreated = false;
      state.sectionUpdated = false;
      state.error = null;
    },

    // ✅ UI-only reorder (Drag & Drop)
    reorderSections: (state, action: PayloadAction<HomeSection[]>) => {
      state.sections = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createHomeSection.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.sectionCreated = false;
      })
      .addCase(
        createHomeSection.fulfilled,
        (state, action: PayloadAction<HomeSection>) => {
          state.loading = false;
          state.sections.push(action.payload);
          state.sectionCreated = true;
        }
      )
      .addCase(
        createHomeSection.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Create failed";
        }
      )

      // FETCH
      .addCase(fetchHomeSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchHomeSections.fulfilled,
        (state, action: PayloadAction<HomeSection[]>) => {
          state.loading = false;
          state.sections = action.payload;
        }
      )
      .addCase(
        fetchHomeSections.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Fetch failed";
        }
      )

      // UPDATE
      .addCase(updateHomeSection.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.sectionUpdated = false;
      })
      .addCase(
        updateHomeSection.fulfilled,
        (state, action: PayloadAction<HomeSection>) => {
          state.loading = false;
          const index = state.sections.findIndex(
            (s) => s._id === action.payload._id
          );
          if (index !== -1) state.sections[index] = action.payload;
          state.sectionUpdated = true;
        }
      )
      .addCase(
        updateHomeSection.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Update failed";
        }
      )

      // DELETE
      .addCase(deleteHomeSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHomeSection.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = state.sections.filter(
          (s) => s._id !== action.payload
        );
      })
      .addCase(
        deleteHomeSection.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Delete failed";
        }
      );
  },
});

// ---------- Exports ----------
export const {
  resetHomeSectionState,
  reorderSections, // ✅ NOW AVAILABLE
} = homeSectionSlice.actions;

export default homeSectionSlice.reducer;
