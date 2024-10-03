<template>
  <v-row>
    <v-col sm="6" md="12">
      <v-list
        lines="three"
        item-props
        density="compact"
      >
        <template v-for="item in historyItems" :key="item.orderId || item.title">
          <!-- Check if the item has an orderId and wrap the whole item in a router-link -->
       
          <!-- Non-clickable items like dividers or subheaders -->
           <div v-if="item.type === 'subheader'">       
              <div class="pa-6 pb-2 text-medium-emphasis">{{ item.title }}</div>
          </div>
   
          <div v-else-if="item.orderId">
            <v-list-item
              :to="{ name: 'order', params: { order_id: item.orderId } }">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  <div v-html="item.subtitle"></div>
                </v-list-item-subtitle>
            </v-list-item>
          </div>
        </template>
      </v-list>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { groupBy, sortBy } from 'lodash';
import { format, isToday } from 'date-fns';
import { useI18n } from 'vue-i18n';

import orders from '@/composables/localStore/useOrdersStore';
import products from '@/composables/localStore/useProductStore';
import companies from '@/composables/localStore/useCompanyStore';

type Item = {
  title?: string;
  subtitle?: string;
  orderId?: string;
  type?: string;
  inset?: boolean;
};

const { t } = useI18n()

const historyItems = computed(() => {
  let items = [] as Item[];
  const groupedOrders = groupBy(
    sortBy(orders.value, (t) => new Date(t.date)).reverse(),
    (t) => new Date(t.date).toDateString()
  );

  for (const date in groupedOrders) {
    const sortedItems = sortBy(groupedOrders[date].map(o => {
      const orderLinesInfo = o.order_lines.map(ol => {
        const info = { qte: ol.qte, product: getProduct(ol.product_id)?.name };
        return `${info.qte}m ${info.product}`;
      });

      const consumerName = companies.value.find(e => e.id === o.company)?.name || o.individual?.name;
      const intro = `<span class="text-primary">${consumerName}, ${format(o.date, 'p')}</span> &mdash;`;
      const item = {
        title: `${t('order')} ${t('N°')} ${o.index}`,
        subtitle: `${intro} ${orderLinesInfo.join(' ,')}`,
        orderId: o.id
      };
      return item;
    }));

    const firstItem = { type: 'subheader', title: isToday(date) ? t('Today') : format(date, 'yyyy-MM-dd') };
    items.push(firstItem);
    items = items.concat(sortedItems);
  }

  return items;
});

const getProduct = (id: string) => products.value.find(e => e.id == id);
</script>

<style scoped>
.router-link {
  text-decoration: none;
  color: inherit;
}
</style>
