"use strict";
const visit = require("unist-util-visit-parents");
const u = require("unist-builder");
const dedent = require("dedent");
const fromEntries = require("object.fromentries");

const parseParams = (paramString = "") => {
  const params = fromEntries(new URLSearchParams(paramString));

  if (!params.platform) {
    params.platform = "web";
  }

  return params;
};

const processNode = (node, parent) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = parseParams(node.meta);

      // Gather necessary Params
      const name = params.name ? decodeURIComponent(params.name) : "Example";
      const description = params.description
        ? decodeURIComponent(params.description)
        : "Example usage";
      const sampleCode = node.value;
      const dependencies = params.dependencies || "";
      const platform = params.platform || "web";
      const supportedPlatforms = params.supportedPlatforms || "ios,android,web";
      const theme = params.theme || "light";
      const preview = params.preview || "true";
      const loading = params.loading || "lazy";

      const files = {
        "App.js": {
          type: "CODE",
          contents: sampleCode,
        },
        "rn-design-system.js": {
          type: "CODE",
          contents: `
import React from "react";
import { Button as NativeButton, View, StyleSheet } from "react-native";

const Button = ({ text, wrapperStyle = {}, ...props }) => (
  <View style={StyleSheet.flatten([wrapperStyle])}>
    <NativeButton title={text} {...props} />
  </View>
);

export { Button };
          `,
        },
      };

      // Generate Node for SnackPlayer
      // See https://github.com/expo/snack/blob/main/docs/embedding-snacks.md
      const snackPlayerDiv = u("html", {
        value: dedent`
          <div
            data-snack-name="${name}"
            data-snack-description="${description}"
            data-snack-code=""
            data-snack-files="${encodeURIComponent(JSON.stringify(files))}"
            data-snack-dependencies="${dependencies}"
            data-snack-platform="${platform}"
            data-snack-supported-platforms="${supportedPlatforms}"
            data-snack-theme="${theme}"
            data-snack-preview="${preview}"
            data-snack-loading="${loading}"
            style="overflow:hidden;background:#fafafa;border:1px solid rgba(0,0,0,.08);border-radius:4px;height:505px;width:100%"
          ></div>
          `,
      });

      // Replace code block with SnackPlayer Node
      const index = parent[0].children.indexOf(node);
      parent[0].children.splice(index, 1, snackPlayerDiv);
    } catch (e) {
      return reject(e);
    }
    resolve();
  });
};

const SnackPlayer = () => {
  return (tree) =>
    new Promise(async (resolve, reject) => {
      const nodesToProcess = [];
      // Parse all CodeBlocks
      visit(tree, "code", (node, parent) => {
        // Add SnackPlayer CodeBlocks to processing queue
        if (node.lang == "SnackPlayer") {
          nodesToProcess.push(processNode(node, parent));
        }
      });

      // Wait for all promises to be resolved
      Promise.all(nodesToProcess).then(resolve()).catch(reject());
    });
};

module.exports = SnackPlayer;
