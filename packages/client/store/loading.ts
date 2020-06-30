import { MutationTree } from 'vuex';

interface LoaderState {
  isLoading: boolean;
}

export const state = (): LoaderState => ({
  isLoading: false,
});

export const mutations: MutationTree<LoaderState> = {
  START_LOADING: (state) => !state.isLoading,
  FINISH_LOADING: (state) => !state.isLoading,
};
