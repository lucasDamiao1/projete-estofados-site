export type SiteContentEntry = {
  key: string;
  section: string;
  value: string;
};

export function createSiteContentReader(contents: SiteContentEntry[]) {
  const contentByKey = new Map(
    contents.map((content) => [`${content.section}.${content.key}`, content.value]),
  );

  return (section: string, key: string, fallback: string) => {
    const value = contentByKey.get(`${section}.${key}`);

    return value?.trim() ? value : fallback;
  };
}
