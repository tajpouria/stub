import { MutationTree } from 'vuex';

interface LoaderState {
  isLoading: number;
}

export const state = (): LoaderState => ({
  isLoading: 0,
});

export const getters = {
  loading: (state: LoaderState) => state.isLoading,
};

export const mutations: MutationTree<LoaderState> = {
  START_LOADING: (state) => state.isLoading++,
  FINISH_LOADING: (state) => state.isLoading--,
};
