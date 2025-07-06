CREATE TABLE "site_analysis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"monitor_id" uuid NOT NULL,
	"site_type" text NOT NULL,
	"seo_issue" text NOT NULL,
	"broken_link" text NOT NULL,
	"performance" text NOT NULL,
	"security" text NOT NULL,
	"status" "app_status",
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "site_analysis" ADD CONSTRAINT "site_analysis_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE no action ON UPDATE no action;