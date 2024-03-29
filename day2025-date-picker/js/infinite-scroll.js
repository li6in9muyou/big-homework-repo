class WaitGroup {
  constructor(init = 0) {
    this.current = init;
    this.allDone = null;
    this.block = new Promise((resolve) => (this.allDone = resolve));
  }
  done() {
    this.current -= 1;
    if (this.current <= 0) {
      this.allDone();
    }
  }
  add(cnt = 1) {
    this.current += cnt;
  }
  wait() {
    return this.block;
  }
}

export default function addInfiniteScrollEffect(list, getItem, options) {
  return new (function () {
    this.MAX_ITEM_COUNT = options?.maxLen ?? 10;
    this.INIT_ITEM_COUNT = options?.initLen ?? 6;
    this.PRELOAD_ITEM_COUNT = options?.preload ?? 3;
    this.getLoading =
      options?.getLoading ??
      (() =>
        $("<div>loading</div>").css({
          "box-sizing": "border-box",
          height: "269px",
          margin: "6px",
          "text-align": "center",
          "background-color": "dimgray",
          border: "solid 2px white",
          "font-size": " 90px",
        }));
    this.$list = $(list);
    this.getItem = getItem;
    this.keyFront = 0;
    this.keyBack = NaN;
    this.isLoading = false;
    this.obFront = new IntersectionObserver(
      (entries) => {
        console.assert(
          entries.length === 1,
          "multiple observation targets in this.obFront",
        );
        const front = entries[0];
        console.log(
          "this.obFront:" + $(front.target).attr("data-ifs-key"),
          front.intersectionRatio,
        );
        if (front.intersectionRatio > 0.75 && !this.isLoading) {
          this.addFrontManyItems(this.PRELOAD_ITEM_COUNT);
        }
      },
      {
        root: this.$list[0] ?? this.$list,
        rootMargin: "0px",
        threshold: [0.75],
      },
    );
    this.obBack = new IntersectionObserver(
      (entries) => {
        console.assert(
          entries.length === 1,
          "multiple observation targets in this.obBack",
        );
        const back = entries[0];
        console.log(
          "this.obBack:" + $(back.target).attr("data-ifs-key"),
          back.intersectionRatio,
        );
        if (back.intersectionRatio > 0.75 && !this.isLoading) {
          this.addBackManyItems(this.PRELOAD_ITEM_COUNT);
        }
      },
      {
        root: this.$list[0] ?? this.$list,
        rootMargin: "0px",
        threshold: [0.75],
      },
    );
    this.getExcessiveItemCnt = () =>
      this.keyBack - this.keyFront - this.MAX_ITEM_COUNT + 1;

    this.__helperRemoveManyItems = (cnt, getNextKey) => {
      this.$list.children("[data-ifs-key]").each((_, item) => {
        this.obFront.unobserve(item);
        this.obBack.unobserve(item);
      });
      for (let i = 0; i < cnt; i++) {
        const key = getNextKey();
        this.$list.children(`[data-ifs-key='${key}']`).remove();
      }
      const items = this.$list.children("[data-ifs-key]");
      this.obFront.observe(items.eq(0)[0]);
      this.obBack.observe(items.eq(-1)[0]);
    };

    this.__helperAddManyItems = (cnt, getNextKey, listModifier) => {
      this.isLoading = true;

      const batchGetItem = new Map();
      const loadingPlaceholders = new Map();
      const allItemLoaded = new WaitGroup();
      for (let i = 0; i < cnt; i++) {
        allItemLoaded.add();
        const key = getNextKey();

        const loading = this.getLoading(key);
        // todo: what if getItem throws or fails
        const item = this.getItem(key);
        console.assert(
          !!item,
          `infinite-scroll: invalid item !!item = false, key = ${key}`,
        );
        const waitGetItem = Promise.resolve(item);
        loadingPlaceholders.set(key, loading);
        batchGetItem.set(key, waitGetItem);

        const ifHaveToWaitGetItem = typeof item.then === "function";
        if (ifHaveToWaitGetItem) {
          waitGetItem
            .then((item) => $(item))
            .then(($item) => {
              allItemLoaded.done();
              $item.attr("data-ifs-key", key);
              return $item;
            })
            .then(($item) => {
              $item.insertAfter(loading);
              loading.remove();
              return $item;
            });
          listModifier(loading);
        } else {
          allItemLoaded.done();
          $(item).attr("data-ifs-key", key);
          listModifier(item);
        }
      }

      const w = allItemLoaded.wait();
      w.then(() => (this.isLoading = false)).then(() => {
        const items = this.$list.children("[data-ifs-key]");
        items.each((_, item) => {
          this.obFront.unobserve(item);
          this.obBack.unobserve(item);
        });
        this.obFront.observe(items.eq(0)[0]);
        this.obBack.observe(items.eq(-1)[0]);
      });

      return {
        wait: w,
        item: batchGetItem,
        loading: loadingPlaceholders,
      };
    };

    this.addFrontManyItems = (cnt = this.PRELOAD_ITEM_COUNT) => {
      const { wait, loading } = this.__helperAddManyItems(
        cnt,
        () => {
          this.keyFront -= 1;
          return this.keyFront;
        },
        this.$list.prepend.bind(this.$list),
      );
      // todo: changing initValue to -18 makes key=0 item stay perfectly still, but I don't know how to compute this value
      this.$list.scrollTop(
        Array.from(loading.values()).reduce(
          (h, ld) => $(ld).outerHeight(true) + h,
          0,
        ),
      );
      return wait.then(() =>
        this.__helperRemoveManyItems(
          this.getExcessiveItemCnt(),
          () => this.keyBack--,
        ),
      );
    };

    this.addBackManyItems = (cnt = this.PRELOAD_ITEM_COUNT) => {
      const { wait: waitAllLoaded } = this.__helperAddManyItems(
        cnt,
        () => {
          if (Number.isNaN(this.keyBack)) {
            this.keyBack = 0;
            return this.keyBack;
          } else {
            this.keyBack++;
          }
          return this.keyBack;
        },
        this.$list.append.bind(this.$list),
      );
      waitAllLoaded.then(() =>
        this.__helperRemoveManyItems(
          this.getExcessiveItemCnt(),
          () => this.keyFront++,
        ),
      );
      return waitAllLoaded;
    };

    this.addBackManyItems(this.INIT_ITEM_COUNT);
  })();
}
