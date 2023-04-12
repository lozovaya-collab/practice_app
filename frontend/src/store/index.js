import { createStore } from 'vuex';
import tasks from '@/store/modules/tasks';
import categories from './modules/categories';



// Create a new store instance.
const store = createStore({
    modules: {
        tasks,
        categories
    }
});

export default store;