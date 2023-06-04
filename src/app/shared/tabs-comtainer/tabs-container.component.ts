import { Component, ContentChildren, AfterContentInit, QueryList } from '@angular/core';
import {TabComponent} from "../tab/tab.component";

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit{
  @ContentChildren(TabComponent) tabs = new QueryList<TabComponent>();

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter((tab) => tab.active);
    if (!activeTabs || activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: TabComponent) {
    this.tabs.forEach((tab) => tab.active = false);
    tab.active = true;

    // NOTE return false it mean preventing default behaviour is adding the hash from the URL
    // if it in the address bar
    return false;
  }
}
