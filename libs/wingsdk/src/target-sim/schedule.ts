import { join } from "path";
import { Construct } from "constructs";
import { EventMapping } from "./event-mapping";
import { Function } from "./function";
import { ISimulatorResource } from "./resource";
import { SCHEDULE_TYPE, ScheduleSchema } from "./schema-resources";
import {
  bindSimulatorResource,
  makeSimulatorJsClient,
  convertDurationToCronExpression,
} from "./util";
import * as cloud from "../cloud";
import { Connections } from "../core";
import { convertBetweenHandlers } from "../shared/convert";
import { Display, IInflightHost } from "../std";
import { BaseResourceSchema } from "../testing";

/**
 * Simulator implementation of `cloud.Schedule`.
 *
 * @inflight `@winglang/sdk.cloud.IScheduleClient`
 */
export class Schedule extends cloud.Schedule implements ISimulatorResource {
  private readonly cronExpression: string;

  constructor(scope: Construct, id: string, props: cloud.ScheduleProps = {}) {
    super(scope, id, props);
    const { rate, cron } = props;

    this.cronExpression = cron ?? convertDurationToCronExpression(rate!);
  }

  public onTick(
    inflight: cloud.IScheduleOnTickHandler,
    props: cloud.ScheduleOnTickProps = {}
  ): cloud.Function {
    const hash = inflight.node.addr.slice(-8);
    const functionHandler = convertBetweenHandlers(
      this,
      `${this.node.id}OnTickHandler${hash}`,
      inflight,
      join(__dirname, "schedule.ontick.inflight.js"),
      "ScheduleOnTickHandlerClient"
    );

    const fn = Function._newFunction(
      this,
      `${this.node.id}-OnTick-${hash}`,
      functionHandler,
      props
    );
    Display.of(fn).sourceModule = Display.SDK_SOURCE_MODULE;
    Display.of(fn).title = "onTick()";

    new EventMapping(this, `${this.node.id}-OnTickMapping-${hash}`, {
      subscriber: fn,
      publisher: this,
      subscriptionProps: {},
    });

    Connections.of(this).add({
      source: this,
      target: fn,
      name: "onTick()",
    });

    return fn;
  }

  public toSimulator(): BaseResourceSchema {
    const schema: ScheduleSchema = {
      type: SCHEDULE_TYPE,
      path: this.node.path,
      props: {
        cronExpression: this.cronExpression,
      },
      attrs: {} as any,
    };
    return schema;
  }

  /** @internal */
  public _toInflight(): string {
    return makeSimulatorJsClient(__filename, this);
  }

  public bind(host: IInflightHost, ops: string[]): void {
    bindSimulatorResource(__filename, this, host);
    ops;
  }
}
