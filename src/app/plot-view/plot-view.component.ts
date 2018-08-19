import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { JsonPipe } from '@angular/common';


import { Chart } from 'chart.js';
import * as jsonata from 'jsonata';


import { KeysPipe } from '../keys.pipe';
import { PropertyPipe } from '../property.pipe';
import { PlotScript } from '../plot-script';
import { DataFile } from '../data-file';
import { PlotConfigService } from '../plot-config.service';
import { PlotDataService } from '../plot-data.service'


@Component({
  selector: 'app-plot-view',
  templateUrl: './plot-view.component.html',
  styleUrls: ['./plot-view.component.css']
})
export class PlotViewComponent implements OnInit {
  @ViewChild('chartCanvas') chartCanvas;

  constructor(
    private configService: PlotConfigService,
    private dataService: PlotDataService
  ) { }

  ngOnInit() {
  }

  @Input()
  set data_files(data_files: string[]) {
    this.dataService.getDataFiles(data_files)
      .subscribe(data => {
        this.data = data;
        this.updatePlot();
      });
  }

  get data_files(): string[] {
    return this.data.map(file => file.name);
  }

  @Input()
  set script_name(script_name) {
    this.configService.getPlotScript(script_name)
      .subscribe(script => {
        this.script = script;
        this.updatePlot();
      });
  }

  get script_name(): string {
    return this.script.name;
  }

  @Input()
  set jsonataScript(jsonataScript: string) {
    this.jsonataScript_ = jsonataScript;
    this.updatePlot();
  }

  get jsonataScript(): string {
    return this.jsonataScript_;
  }

  updatePlot(): void {
    console.log("got script: " + this.jsonataScript_);
    // let expression = jsonata("x");
    // let parsed = expression.evaluate([{"x": 15}, {"x" : 22}]);
    // console.log(parsed);
    let generator: any = (new Function(this.script.code))();
    this.plotData = generator.generate_plot_data(this.data);
    this.redrawPlot();
  }

  redrawPlot(): void {
    if (this.plot) {
      this.plot.destroy();
    }
    let ctx = this.chartCanvas.nativeElement.getContext("2d");
    let copy = JSON.parse(JSON.stringify(this.plotData));
    this.plot = new Chart(ctx, copy);
  }

  data: DataFile[] = [];
  script: PlotScript = new PlotScript();
  jsonataScript_: string;
  plotData: any;
  plot: Chart;
  verbose: boolean = false;
}