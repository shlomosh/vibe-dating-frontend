
export const mockProfileImageUrls = (): string[] => {
  const numImages = Math.floor(Math.random() * 5) + 1; // 1 to 5 images
  const urls: string[] = [];

  for (let i = 0; i < numImages; i++) {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    urls.push(`https://picsum.photos/800/1200?random=${randomId}`);
  }

  return urls;
};





