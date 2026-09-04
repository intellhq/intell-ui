import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ReportShareLink } from "@/types/report-share";

const REPORT_SHARE_STORAGE_KEY = "intell-report-share-links";

interface ReportShareState {
  links: Record<string, ReportShareLink>;
  upsertLink: (link: ReportShareLink) => void;
  getLink: (reportId: string) => ReportShareLink | undefined;
  clearLink: (reportId: string) => void;
}

export const useReportShareStore = create<ReportShareState>()(
  persist(
    (set, get) => ({
      links: {},
      upsertLink: (link) =>
        set((state) => ({
          links: {
            ...state.links,
            [link.reportId]: link,
          },
        })),
      getLink: (reportId) => get().links[reportId],
      clearLink: (reportId) =>
        set((state) => {
          const next = { ...state.links };
          delete next[reportId];
          return { links: next };
        }),
    }),
    {
      name: REPORT_SHARE_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ links: state.links }),
    },
  ),
);

