import { h5pApi } from '../lib/axios';

export const h5pService = {
  getNewEditorModel: async (): Promise<any> => {
    const response = await h5pApi.get('/h5p/api/editor');
    return response.data;
  },

  getEditorModelById: async (contentId: string): Promise<any> => {
    const response = await h5pApi.get(`/h5p/api/editor/${contentId}`);
    return response.data;
  },

  saveNewContent: async (
    library: string,
    params: { params: any; metadata: any },
  ): Promise<{ contentId: string; metadata: any }> => {
    const response = await h5pApi.post('/h5p/api/content', {
      library,
      params: params.params,
      metadata: params.metadata,
    });
    return response.data;
  },

  updateContent: async (
    contentId: string,
    library: string,
    params: { params: any; metadata: any },
  ): Promise<{ contentId: string; metadata: any }> => {
    const response = await h5pApi.patch(`/h5p/api/content/${contentId}`, {
      library,
      params: params.params,
      metadata: params.metadata,
    });
    return response.data;
  },

  getPlayerModel: async (contentId: string): Promise<any> => {
    const response = await h5pApi.get(`/h5p/api/play/${contentId}`);
    return response.data;
  },
};
