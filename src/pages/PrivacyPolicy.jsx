import React from "react";
import { useGetcmsPrivacyQuery } from "../redux/api/cmsApi";
import { Spin, Alert } from "antd";
import { motion, AnimatePresence } from "framer-motion";

export default function PrivacyPolicy() {
  const { data, isLoading, isError } = useGetcmsPrivacyQuery();
  const htmlContent = data?.data?.content || "";

  return (
    <section className="py-16 mt-10 px-2 sm:py-20 sm:px-4 md:py-28 md:px-6 bg-gradient-to-br from-[#f5f9ff] to-[#e6f0ff] text-gray-800 min-h-[60vh]">
      <div className="mx-auto w-full max-w-[90vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-10 text-[#012A56] break-words">
          Privacy Policy
        </h1>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-[50vh] py-20"
              aria-live="polite"
              aria-busy="true"
            >
              <Spin tip="Loading Privacy Policy..." />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {!isLoading && isError && (
          <Alert
            message="Error"
            description="Failed to load the Privacy Policy. Please try again later."
            type="error"
            showIcon
            className="my-10 h-[50vh]"
          />
        )}

        {/* Content */}
        {!isLoading && !isError && (
          <div
            className="space-y-6 sm:space-y-8 text-[16px] sm:text-lg leading-relaxed text-gray-700 prose lg:prose-xl max-w-none overflow-x-auto"
            style={{ wordBreak: "break-word" }}
            dangerouslySetInnerHTML={{
              __html: htmlContent
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/(<br\s*\/?>)+/g, "<br />")
                .replace(
                  /(<h1>)/g,
                  '<h1 class="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-[#012A56] mb-4 break-words">'
                )
                .replace(
                  /(<h2>)/g,
                  '<h2 class="text-lg sm:text-2xl font-semibold text-[#012A56] mb-3 break-words">'
                )
                .replace(
                  /(<h3>)/g,
                  '<h3 class="text-base sm:text-xl font-medium text-[#1558b3] mb-2 break-words">'
                )
                .replace(/(<ul>)/g, '<ul class="list-disc ml-5">')
                .replace(/(<li>)/g, '<li class="mb-1">')
                .replace(/(<p>)/g, '<p class="mb-3">')
                .replace(
                  /<table\b/g,
                  '<table style="display: block; overflow-x: auto; width: 100%;"'
                ),
            }}
          />
        )}
      </div>
    </section>
  );
}
