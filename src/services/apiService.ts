export interface Article {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export const apiService = {
  /**
   * Mengambil data artikel secara real-time dari API JSONPlaceholder
   */
  async getArticles(): Promise<Article[]> {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6');
      if (!response.ok) {
        throw new Error('Gagal mengambil artikel dari API.');
      }
      const data: Article[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error in apiService.getArticles:', error);
      throw error;
    }
  },
};
